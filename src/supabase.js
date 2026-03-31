import { createClient } from "@supabase/supabase-js";

const projectUrl = "https://neacexlqswvgbsfsotpp.supabase.co";
const secretKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lYWNleGxxc3d2Z2JzZnNvdHBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NDQwMDksImV4cCI6MjA3NDIyMDAwOX0.aLPWb9aKKLBsJ_8T1nmyTwCHSx68jqyXG9i8LWJO5zA";

export const supabase = createClient(projectUrl, secretKey);
