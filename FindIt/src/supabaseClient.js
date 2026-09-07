import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://eghqdymbcesymtgsjivb.supabase.co";
const supabaseAnonKey = "sb_publishable_F4gJ5D75s5vFTDChCsWBWg__tijvrAH";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);