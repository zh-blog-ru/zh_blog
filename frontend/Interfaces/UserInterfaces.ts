export interface UserInterfaces {
    id: number;
    username: string;
    email: string;
    create_at: Date;
    update_at: Date;
    is_active: boolean;
    role: "user" | "admin";
    about_me: string | null;
    profile_picture_url: string | null;
}