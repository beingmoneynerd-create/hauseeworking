import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export interface Home {
  id: string;
  user_id: string;
  workspace_id: string;
  address: string;
  neighborhood: string | null;
  price: number;
  bedrooms: number;
  bathrooms: number;
  year_built: number | null;
  property_taxes: number | null;
  square_footage: number | null;
  favorite: boolean;
  compare_selected: boolean;
  evaluation_status: 'not_started' | 'in_progress' | 'completed';
  offer_intent: 'yes' | 'maybe' | 'no' | null;
  overall_rating: number;
  primary_photo: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateHomeInput {
  address: string;
  neighborhood?: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  year_built?: number;
  square_footage?: number;
  primary_photo?: string;
}

export function useHomes() {
  const { user } = useAuth();
  const [homes, setHomes] = useState<Home[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHomes = useCallback(async () => {
    if (!user) {
      setHomes([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('homes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setHomes(data || []);
    } catch (err) {
      console.error('Error fetching homes:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch homes');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchHomes();
  }, [fetchHomes]);

  const getOrCreateWorkspace = async (): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    const { data: membership, error: membershipError } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (membershipError) throw membershipError;

    if (membership) {
      return membership.workspace_id;
    }

    const workspaceName = user.email?.split('@')[0] || 'My Workspace';

    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .insert({
        name: `${workspaceName}'s Workspace`,
        created_by: user.id,
      })
      .select()
      .single();

    if (workspaceError) throw workspaceError;

    const { error: memberError } = await supabase
      .from('workspace_members')
      .insert({
        workspace_id: workspace.id,
        user_id: user.id,
        role: 'owner',
      });

    if (memberError) throw memberError;

    return workspace.id;
  };

  const checkDuplicate = async (address: string): Promise<boolean> => {
    if (!user) return false;

    const { data, error } = await supabase
      .from('homes')
      .select('id')
      .eq('user_id', user.id)
      .ilike('address', address.trim())
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking duplicate:', error);
    }

    return !!data;
  };

  const addHome = async (input: CreateHomeInput): Promise<Home> => {
    if (!user) throw new Error('User not authenticated');

    const isDuplicate = await checkDuplicate(input.address);
    if (isDuplicate) {
      throw new Error('This address already exists in your homes list');
    }

    const workspaceId = await getOrCreateWorkspace();

    const newHome = {
      user_id: user.id,
      workspace_id: workspaceId,
      address: input.address.trim(),
      neighborhood: input.neighborhood?.trim() || null,
      price: input.price,
      bedrooms: input.bedrooms,
      bathrooms: input.bathrooms,
      year_built: input.year_built || null,
      square_footage: input.square_footage || null,
      primary_photo: input.primary_photo || null,
      favorite: false,
      compare_selected: false,
      evaluation_status: 'not_started' as const,
      offer_intent: null,
      overall_rating: 0,
    };

    const { data, error } = await supabase
      .from('homes')
      .insert(newHome)
      .select()
      .single();

    if (error) throw error;

    setHomes((prev) => [data, ...prev]);
    return data;
  };

  const updateHome = async (id: string, updates: Partial<Home>): Promise<Home> => {
    const { data, error } = await supabase
      .from('homes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    setHomes((prev) => prev.map((home) => (home.id === id ? data : home)));
    return data;
  };

  const toggleFavorite = async (id: string): Promise<void> => {
    const home = homes.find((h) => h.id === id);
    if (!home) return;

    const newFavoriteStatus = !home.favorite;

    setHomes((prev) =>
      prev.map((h) => (h.id === id ? { ...h, favorite: newFavoriteStatus } : h))
    );

    try {
      await updateHome(id, { favorite: newFavoriteStatus });
    } catch (err) {
      setHomes((prev) =>
        prev.map((h) => (h.id === id ? { ...h, favorite: home.favorite } : h))
      );
      throw err;
    }
  };

  const toggleCompare = async (id: string): Promise<void> => {
    const home = homes.find((h) => h.id === id);
    if (!home) return;

    const selectedCount = homes.filter((h) => h.compare_selected).length;

    if (!home.compare_selected && selectedCount >= 3) {
      throw new Error('You can compare up to 3 homes');
    }

    const newCompareStatus = !home.compare_selected;

    setHomes((prev) =>
      prev.map((h) => (h.id === id ? { ...h, compare_selected: newCompareStatus } : h))
    );

    try {
      await updateHome(id, { compare_selected: newCompareStatus });
    } catch (err) {
      setHomes((prev) =>
        prev.map((h) => (h.id === id ? { ...h, compare_selected: home.compare_selected } : h))
      );
      throw err;
    }
  };

  const deleteHome = async (id: string): Promise<void> => {
    const { error } = await supabase.from('homes').delete().eq('id', id);

    if (error) throw error;

    setHomes((prev) => prev.filter((home) => home.id !== id));
  };

  const clearCompareSelection = async (): Promise<void> => {
    const selectedIds = homes.filter((h) => h.compare_selected).map((h) => h.id);

    if (selectedIds.length === 0) return;

    setHomes((prev) => prev.map((h) => ({ ...h, compare_selected: false })));

    try {
      const { error } = await supabase
        .from('homes')
        .update({ compare_selected: false })
        .in('id', selectedIds);

      if (error) throw error;
    } catch (err) {
      await fetchHomes();
      throw err;
    }
  };

  return {
    homes,
    loading,
    error,
    addHome,
    updateHome,
    deleteHome,
    toggleFavorite,
    toggleCompare,
    clearCompareSelection,
    refetch: fetchHomes,
  };
}
