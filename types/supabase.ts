export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	public: {
		Tables: {
			bookmarks: {
				Row: {
					id: string;
					user_id: string;
					mod_name: string;
					mod_slug: string | null;
					source_urls: Json;
					icon_url: string | null;
					memo: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					mod_name: string;
					mod_slug?: string | null;
					source_urls: Json;
					icon_url?: string | null;
					memo?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					user_id?: string;
					mod_name?: string;
					mod_slug?: string | null;
					source_urls?: Json;
					icon_url?: string | null;
					memo?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			mod_lists: {
				Row: {
					id: string;
					user_id: string;
					name: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					name: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					user_id?: string;
					name?: string;
					created_at?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			mod_list_items: {
				Row: {
					id: string;
					user_id: string;
					list_id: string;
					mod_name: string;
					mod_slug: string | null;
					source_urls: Json;
					icon_url: string | null;
					pinned_version: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					list_id: string;
					mod_name: string;
					mod_slug?: string | null;
					source_urls: Json;
					icon_url?: string | null;
					pinned_version?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					user_id?: string;
					list_id?: string;
					mod_name?: string;
					mod_slug?: string | null;
					source_urls?: Json;
					icon_url?: string | null;
					pinned_version?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
		};
		Views: Record<string, never>;
		Functions: Record<string, never>;
		Enums: Record<string, never>;
		CompositeTypes: Record<string, never>;
	};
};
