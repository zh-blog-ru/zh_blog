import Image from 'next/image'
import Button from './Button'
import ShowArticles from './ShowArticles'
import s from './MiniArticles.module.css'
import { DictionaryType } from '@/i18n/getDictionary'
import { getUsersArticles } from '../../../../../../../serverAction/getUsersArticles'
import LocalizedLink from '@/i18n/routes/LocalizedLink'
export async function MiniArticles({
    dict,
    user_id
}: {
    dict: DictionaryType['blog']['profile']['likes'],
    user_id: number
}) {
    let articles = await getUsersArticles(user_id)
    if (articles.length === 0) {
        return (
            <div>
                {dict.empty}
            </div>
        )
    }
    return (
        <div className={s.likes}>
            <ShowArticles interTitle={dict.title}>
                <div className={s.ButtonContainer}>
                    <div className={s.articleContainer} id='articleContainer'>
                        <Button position='left' containerId='articleContainer' />
                        <div className={s.articles}>
                            {articles.map((item, index) => (
                                <div key={index} className={s.article}>
                                    <LocalizedLink href={'/articles/' + item.id}>
                                        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
                                            <Image src={item.img} alt='photo' fill
                                                style={{ objectFit: 'cover', borderRadius: '15px' }} sizes="(min-width: 768px) 100vw, 50vw" priority />
                                        </div>
                                    </LocalizedLink>
                                    <h3>
                                        {item.title}
                                    </h3>
                                </div>
                            ))}
                        </div>
                        <Button position='right' containerId='articleContainer' />
                    </div>
                </div>
            </ShowArticles>
        </div>
    )
}
