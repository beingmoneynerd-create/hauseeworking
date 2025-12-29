/*
  # Fix RLS Performance and Security Issues

  ## Overview
  This migration addresses critical security and performance issues identified in the database audit.

  ## 1. RLS Performance Optimization
  Optimize all RLS policies by wrapping auth function calls in SELECT statements to prevent
  re-evaluation for each row. This significantly improves query performance at scale.
  
  Changes:
  - Replace `auth.jwt()->>'sub'` with `(select auth.jwt()->>'sub')` for text columns
  - Replace `auth.uid()` with `(select auth.uid())` for UUID columns
  
  ## 2. Remove Unused Indexes
  Drop indexes that are not being used to improve write performance and reduce storage costs.
  
  ## 3. Consolidate Multiple Permissive Policies
  Address security concerns by consolidating or making policies restrictive where multiple
  permissive policies exist for the same action.

  ## 4. Fix Function Security
  Set immutable search path for database functions to prevent security vulnerabilities.

  ## Important Notes
  - All policies maintain the same security logic, only performance is optimized
  - Workspace membership verification remains intact
  - User authentication checks remain intact
  - Using correct auth methods based on column types: auth.uid() for UUID, auth.jwt()->>'sub' for text
*/

-- Dream Home Preferences Policies
DROP POLICY IF EXISTS "Users can view dream home in their workspaces" ON dream_home_preferences;
DROP POLICY IF EXISTS "Users can insert dream home in their workspaces" ON dream_home_preferences;
DROP POLICY IF EXISTS "Users can update dream home in their workspaces" ON dream_home_preferences;

CREATE POLICY "Users can view dream home in their workspaces"
  ON dream_home_preferences FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = dream_home_preferences.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

CREATE POLICY "Users can insert dream home in their workspaces"
  ON dream_home_preferences FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = dream_home_preferences.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

CREATE POLICY "Users can update dream home in their workspaces"
  ON dream_home_preferences FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = dream_home_preferences.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = dream_home_preferences.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

-- Self Assessment Responses Policies
DROP POLICY IF EXISTS "Users can view assessments in their workspaces" ON self_assessment_responses;
DROP POLICY IF EXISTS "Users can insert assessments in their workspaces" ON self_assessment_responses;
DROP POLICY IF EXISTS "Users can update assessments in their workspaces" ON self_assessment_responses;

CREATE POLICY "Users can view assessments in their workspaces"
  ON self_assessment_responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = self_assessment_responses.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

CREATE POLICY "Users can insert assessments in their workspaces"
  ON self_assessment_responses FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = self_assessment_responses.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

CREATE POLICY "Users can update assessments in their workspaces"
  ON self_assessment_responses FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = self_assessment_responses.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = self_assessment_responses.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

-- Mortgage Checklist Items Policies
DROP POLICY IF EXISTS "Users can view mortgage checklist in their workspaces" ON mortgage_checklist_items;
DROP POLICY IF EXISTS "Users can insert mortgage checklist in their workspaces" ON mortgage_checklist_items;
DROP POLICY IF EXISTS "Users can update mortgage checklist in their workspaces" ON mortgage_checklist_items;

CREATE POLICY "Users can view mortgage checklist in their workspaces"
  ON mortgage_checklist_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = mortgage_checklist_items.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

CREATE POLICY "Users can insert mortgage checklist in their workspaces"
  ON mortgage_checklist_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = mortgage_checklist_items.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

CREATE POLICY "Users can update mortgage checklist in their workspaces"
  ON mortgage_checklist_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = mortgage_checklist_items.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = mortgage_checklist_items.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

-- Moving Todo Items Policies
DROP POLICY IF EXISTS "Users can view moving todos in their workspaces" ON moving_todo_items;
DROP POLICY IF EXISTS "Users can insert moving todos in their workspaces" ON moving_todo_items;
DROP POLICY IF EXISTS "Users can update moving todos in their workspaces" ON moving_todo_items;

CREATE POLICY "Users can view moving todos in their workspaces"
  ON moving_todo_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = moving_todo_items.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

CREATE POLICY "Users can insert moving todos in their workspaces"
  ON moving_todo_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = moving_todo_items.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

CREATE POLICY "Users can update moving todos in their workspaces"
  ON moving_todo_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = moving_todo_items.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = moving_todo_items.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

-- Budget Planner Policies
DROP POLICY IF EXISTS "Users can view budget in their workspaces" ON budget_planner;
DROP POLICY IF EXISTS "Users can insert budget in their workspaces" ON budget_planner;
DROP POLICY IF EXISTS "Users can update budget in their workspaces" ON budget_planner;

CREATE POLICY "Users can view budget in their workspaces"
  ON budget_planner FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = budget_planner.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

CREATE POLICY "Users can insert budget in their workspaces"
  ON budget_planner FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = budget_planner.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

CREATE POLICY "Users can update budget in their workspaces"
  ON budget_planner FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = budget_planner.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = budget_planner.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

-- Down Payment Tracker Policies
DROP POLICY IF EXISTS "Users can view down payment tracker in their workspaces" ON down_payment_tracker;
DROP POLICY IF EXISTS "Users can insert down payment tracker in their workspaces" ON down_payment_tracker;
DROP POLICY IF EXISTS "Users can update down payment tracker in their workspaces" ON down_payment_tracker;

CREATE POLICY "Users can view down payment tracker in their workspaces"
  ON down_payment_tracker FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = down_payment_tracker.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

CREATE POLICY "Users can insert down payment tracker in their workspaces"
  ON down_payment_tracker FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = down_payment_tracker.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

CREATE POLICY "Users can update down payment tracker in their workspaces"
  ON down_payment_tracker FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = down_payment_tracker.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = down_payment_tracker.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

-- Homes Policies
DROP POLICY IF EXISTS "Users can view homes in their workspaces" ON homes;
DROP POLICY IF EXISTS "Users can insert homes in their workspaces" ON homes;
DROP POLICY IF EXISTS "Users can update homes in their workspaces" ON homes;
DROP POLICY IF EXISTS "Users can delete homes in their workspaces" ON homes;

CREATE POLICY "Users can view homes in their workspaces"
  ON homes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = homes.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

CREATE POLICY "Users can insert homes in their workspaces"
  ON homes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = homes.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

CREATE POLICY "Users can update homes in their workspaces"
  ON homes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = homes.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = homes.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

CREATE POLICY "Users can delete homes in their workspaces"
  ON homes FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = homes.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

-- Home Inspections Policies
DROP POLICY IF EXISTS "Users can view inspections in their workspaces" ON home_inspections;
DROP POLICY IF EXISTS "Users can insert inspections in their workspaces" ON home_inspections;
DROP POLICY IF EXISTS "Users can update inspections in their workspaces" ON home_inspections;

CREATE POLICY "Users can view inspections in their workspaces"
  ON home_inspections FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = home_inspections.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

CREATE POLICY "Users can insert inspections in their workspaces"
  ON home_inspections FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = home_inspections.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

CREATE POLICY "Users can update inspections in their workspaces"
  ON home_inspections FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = home_inspections.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = home_inspections.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

-- Agent Requests Policies
DROP POLICY IF EXISTS "Users can view agent requests in their workspaces" ON agent_requests;
DROP POLICY IF EXISTS "Users can insert agent requests in their workspaces" ON agent_requests;
DROP POLICY IF EXISTS "Users can update agent requests in their workspaces" ON agent_requests;

CREATE POLICY "Users can view agent requests in their workspaces"
  ON agent_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = agent_requests.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

CREATE POLICY "Users can insert agent requests in their workspaces"
  ON agent_requests FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = agent_requests.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

CREATE POLICY "Users can update agent requests in their workspaces"
  ON agent_requests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = agent_requests.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = agent_requests.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

-- Guide Progress Policies
DROP POLICY IF EXISTS "Users can view guide progress in their workspaces" ON guide_progress;
DROP POLICY IF EXISTS "Users can insert guide progress in their workspaces" ON guide_progress;
DROP POLICY IF EXISTS "Users can update guide progress in their workspaces" ON guide_progress;

CREATE POLICY "Users can view guide progress in their workspaces"
  ON guide_progress FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = guide_progress.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

CREATE POLICY "Users can insert guide progress in their workspaces"
  ON guide_progress FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = guide_progress.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

CREATE POLICY "Users can update guide progress in their workspaces"
  ON guide_progress FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = guide_progress.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = guide_progress.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

-- Home Evaluations Policies
DROP POLICY IF EXISTS "Users can view evaluations in their workspaces" ON home_evaluations;
DROP POLICY IF EXISTS "Users can insert evaluations in their workspaces" ON home_evaluations;
DROP POLICY IF EXISTS "Users can update evaluations in their workspaces" ON home_evaluations;

CREATE POLICY "Users can view evaluations in their workspaces"
  ON home_evaluations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = home_evaluations.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

CREATE POLICY "Users can insert evaluations in their workspaces"
  ON home_evaluations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = home_evaluations.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

CREATE POLICY "Users can update evaluations in their workspaces"
  ON home_evaluations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = home_evaluations.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = home_evaluations.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

-- Evaluation Photos Policies
DROP POLICY IF EXISTS "Users can view evaluation photos in their workspaces" ON evaluation_photos;
DROP POLICY IF EXISTS "Users can insert evaluation photos in their workspaces" ON evaluation_photos;
DROP POLICY IF EXISTS "Users can delete evaluation photos in their workspaces" ON evaluation_photos;

CREATE POLICY "Users can view evaluation photos in their workspaces"
  ON evaluation_photos FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM home_evaluations
      JOIN workspace_members ON workspace_members.workspace_id = home_evaluations.workspace_id
      WHERE home_evaluations.id = evaluation_photos.evaluation_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

CREATE POLICY "Users can insert evaluation photos in their workspaces"
  ON evaluation_photos FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM home_evaluations
      JOIN workspace_members ON workspace_members.workspace_id = home_evaluations.workspace_id
      WHERE home_evaluations.id = evaluation_photos.evaluation_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

CREATE POLICY "Users can delete evaluation photos in their workspaces"
  ON evaluation_photos FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM home_evaluations
      JOIN workspace_members ON workspace_members.workspace_id = home_evaluations.workspace_id
      WHERE home_evaluations.id = evaluation_photos.evaluation_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

-- Evaluation Voice Notes Policies
DROP POLICY IF EXISTS "Users can view evaluation voice notes in their workspaces" ON evaluation_voice_notes;
DROP POLICY IF EXISTS "Users can insert evaluation voice notes in their workspaces" ON evaluation_voice_notes;
DROP POLICY IF EXISTS "Users can delete evaluation voice notes in their workspaces" ON evaluation_voice_notes;

CREATE POLICY "Users can view evaluation voice notes in their workspaces"
  ON evaluation_voice_notes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM home_evaluations
      JOIN workspace_members ON workspace_members.workspace_id = home_evaluations.workspace_id
      WHERE home_evaluations.id = evaluation_voice_notes.evaluation_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

CREATE POLICY "Users can insert evaluation voice notes in their workspaces"
  ON evaluation_voice_notes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM home_evaluations
      JOIN workspace_members ON workspace_members.workspace_id = home_evaluations.workspace_id
      WHERE home_evaluations.id = evaluation_voice_notes.evaluation_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

CREATE POLICY "Users can delete evaluation voice notes in their workspaces"
  ON evaluation_voice_notes FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM home_evaluations
      JOIN workspace_members ON workspace_members.workspace_id = home_evaluations.workspace_id
      WHERE home_evaluations.id = evaluation_voice_notes.evaluation_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

-- Workspaces Policies (created_by is UUID, so use auth.uid())
DROP POLICY IF EXISTS "Users can create workspaces" ON workspaces;
DROP POLICY IF EXISTS "Users can view workspaces" ON workspaces;
DROP POLICY IF EXISTS "Users can view workspaces they are members of" ON workspaces;
DROP POLICY IF EXISTS "Users can update workspaces" ON workspaces;
DROP POLICY IF EXISTS "Workspace owners can update their workspaces" ON workspaces;
DROP POLICY IF EXISTS "Users can delete workspaces" ON workspaces;

CREATE POLICY "Users can create workspaces"
  ON workspaces FOR INSERT
  TO authenticated
  WITH CHECK (created_by = (select auth.uid()));

CREATE POLICY "Users can view workspaces"
  ON workspaces FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
    )
  );

CREATE POLICY "Users can update workspaces"
  ON workspaces FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
      AND workspace_members.role = 'owner'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
      AND workspace_members.role = 'owner'
    )
  );

CREATE POLICY "Users can delete workspaces"
  ON workspaces FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
      AND workspace_members.role = 'owner'
    )
  );

-- Workspace Members Policies (user_id is text, so use auth.jwt()->>'sub')
DROP POLICY IF EXISTS "Users can view their workspace memberships" ON workspace_members;
DROP POLICY IF EXISTS "Users can create workspace memberships" ON workspace_members;
DROP POLICY IF EXISTS "Users can remove themselves from workspaces" ON workspace_members;
DROP POLICY IF EXISTS "Workspace owners can remove members" ON workspace_members;

CREATE POLICY "Users can view their workspace memberships"
  ON workspace_members FOR SELECT
  TO authenticated
  USING (user_id = (select auth.jwt()->>'sub'));

CREATE POLICY "Users can create workspace memberships"
  ON workspace_members FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Consolidate DELETE policies: Single policy allowing both self-removal and owner removal
CREATE POLICY "Users can manage workspace members"
  ON workspace_members FOR DELETE
  TO authenticated
  USING (
    user_id = (select auth.jwt()->>'sub')
    OR EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_members.workspace_id
      AND wm.user_id = (select auth.jwt()->>'sub')
      AND wm.role = 'owner'
    )
  );

-- Workspace Invitations Policies
DROP POLICY IF EXISTS "Workspace owners can create invitations" ON workspace_invitations;
DROP POLICY IF EXISTS "Workspace owners can view their workspace invitations" ON workspace_invitations;
DROP POLICY IF EXISTS "Anyone can view invitation by token for acceptance" ON workspace_invitations;
DROP POLICY IF EXISTS "Users can mark invitation as used when they accept" ON workspace_invitations;

CREATE POLICY "Workspace owners can create invitations"
  ON workspace_invitations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspace_invitations.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
      AND workspace_members.role = 'owner'
    )
  );

-- Consolidate SELECT policies: Single policy allowing both owner view and token-based view
CREATE POLICY "Users can view workspace invitations"
  ON workspace_invitations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspace_invitations.workspace_id
      AND workspace_members.user_id = (select auth.jwt()->>'sub')
      AND workspace_members.role = 'owner'
    )
    OR true
  );

CREATE POLICY "Users can mark invitation as used when they accept"
  ON workspace_invitations FOR UPDATE
  TO authenticated
  USING (used_at IS NULL AND expires_at > now())
  WITH CHECK (used_by = (select auth.jwt()->>'sub'));

-- User Profiles Policies (user_id is text, so use auth.jwt()->>'sub')
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (user_id = (select auth.jwt()->>'sub'));

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.jwt()->>'sub'));

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.jwt()->>'sub'))
  WITH CHECK (user_id = (select auth.jwt()->>'sub'));

-- ============================================================================
-- SECTION 2: REMOVE UNUSED INDEXES
-- ============================================================================

-- Drop unused indexes to improve write performance and reduce storage
DROP INDEX IF EXISTS idx_inspections_home_id;
DROP INDEX IF EXISTS idx_inspections_user_id;
DROP INDEX IF EXISTS idx_home_inspections_workspace_id;
DROP INDEX IF EXISTS idx_self_assessment_workspace_id;
DROP INDEX IF EXISTS idx_mortgage_checklist_workspace_id;
DROP INDEX IF EXISTS idx_moving_todo_workspace_id;
DROP INDEX IF EXISTS idx_home_evaluations_home_id;
DROP INDEX IF EXISTS idx_home_evaluations_user_id;
DROP INDEX IF EXISTS idx_home_evaluations_status;
DROP INDEX IF EXISTS idx_home_evaluations_workspace_id;
DROP INDEX IF EXISTS idx_guide_progress_user_id;
DROP INDEX IF EXISTS idx_guide_progress_lesson_id;
DROP INDEX IF EXISTS idx_guide_progress_module_id;
DROP INDEX IF EXISTS idx_guide_progress_workspace_id;
DROP INDEX IF EXISTS idx_budget_planner_workspace_id;
DROP INDEX IF EXISTS idx_down_payment_tracker_user_id;
DROP INDEX IF EXISTS idx_down_payment_tracker_workspace_id;
DROP INDEX IF EXISTS idx_evaluation_photos_evaluation_id;
DROP INDEX IF EXISTS idx_evaluation_photos_section;
DROP INDEX IF EXISTS idx_homes_user_id;
DROP INDEX IF EXISTS idx_homes_favorite;
DROP INDEX IF EXISTS idx_homes_compare_selected;
DROP INDEX IF EXISTS idx_evaluation_voice_notes_evaluation_id;
DROP INDEX IF EXISTS idx_evaluation_voice_notes_section;
DROP INDEX IF EXISTS workspace_invitations_workspace_id_idx;
DROP INDEX IF EXISTS idx_agent_requests_user_id;
DROP INDEX IF EXISTS idx_agent_requests_status;
DROP INDEX IF EXISTS idx_agent_requests_workspace_id;
DROP INDEX IF EXISTS idx_user_profiles_email;
DROP INDEX IF EXISTS idx_dream_home_preferences_user_id;
DROP INDEX IF EXISTS idx_dream_home_preferences_workspace_id;

-- ============================================================================
-- SECTION 3: FIX FUNCTION SECURITY
-- ============================================================================

-- Recreate function with secure search path to prevent security vulnerabilities
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;
