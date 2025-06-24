export interface CommentsInterfaces {
    id: number,
    create_at: Date,
    update_at: Date,
    data: string,
    parent_comment_id: number,
    username: string,
    profile_picture_url: string
}