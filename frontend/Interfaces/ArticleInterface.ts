export interface ArticleInterface {
    id: number,
    locale: string,
    title: string,
    theme: string[],
    content: string,
    create_at: string,
    update_at: string,
    time_to_read: number,
    resume: string,
    img: string,
    images: string[]
}

export type CreateArticlesInterface = Pick<ArticleInterface, 'time_to_read' | 'img' | 'theme'>
export type UpdateArticlesInterface = Partial<CreateArticlesInterface 
& Pick<
    ArticleInterface, 'content' | 'resume' | 'title'
> & {is_active: boolean}> 