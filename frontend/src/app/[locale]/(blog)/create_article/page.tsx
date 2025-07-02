import React from 'react'
import s from './page.module.css'
import ChangeImage from './_components/ChangeImage'
import Theme from './_components/Theme'
import Form from './_components/Form'
import { IsAdmin } from '../../../../../serverAction/IsAdmin'

export default async function Page() {
    await IsAdmin()
    return (
        <div className={s.main}>
            <h2>Создать статьи</h2>

            <Form 
                className={s.articleContainer}
            >
                <ChangeImage />

                <div className={s.metaData}>
                    <Theme/>

                    <div className={s.metaItem}>
                        <label>Время чтения:</label>
                        <div className={s.timeInputContainer}>
                            <input
                                name='time_to_read'
                                type="number"
                                className={s.timeInput}
                            />
                            <span>мин</span>
                        </div>
                    </div>
                </div>
            </Form>
        </div>
    )
}