'use client'
import LoadPhoto from './LoadPhoto'
import ChangeUsername from './ChangeUsername'
import ChangeEmail from './ChangeEmail'
import ChangePassword from './ChangePassword'
import AboutMe from './AboutMe'
import s from './Settings.module.css'
import { PrivateUserInterfaces } from '../../../../../../serverAction/getCurrentUser'
import { DictionaryType } from '@/i18n/getDictionary'
import { useChangeProfileMutation } from '@/_redux/api/Api'
import { useErrorHandler } from '../../../../../../hooks/useErrorHandler'
import { redirectTo } from '../../../../../../serverAction/RedirectTo'
import DeleteAcc from './DeleteAcc'

export default function Settings({
    user,
    dict
}: {
    user: PrivateUserInterfaces,
    dict: DictionaryType['blog']['settings']
}) {
    const [changeProfile, { isLoading }] = useChangeProfileMutation()
    const { errors, handleError, resetErrors } = useErrorHandler()
    const handleSubmit = async (formData: FormData) => {
        resetErrors()
        const username = formData.get('username') as string
        const about_me = formData.get('about_me') as string
        changeProfile({
            about_me,
            username,
        }).unwrap()
            .then(() => {
                // router.refresh()
                redirectTo(`/settings`, false)
            })
            .catch(err => {
                handleError(err)
            })
    }
    
    return (
        <>
            <form className={s.settings} action={handleSubmit} >
                <LoadPhoto profile_picture_url={user.profile_picture_url} dict={dict.load_photo} />
                <div className={s.inputs}>
                    <ChangeUsername user_username={user.username} dict={dict.change_username} />
                    <ChangeEmail user_email={user.email} dict={dict.change_email} />
                    <ChangePassword dict={dict.change_password} />
                </div>
                <AboutMe status={user.about_me} dict={dict.about_me} />
                <div className={s.error}>
                    <div className={s.buttons}>
                        <button className={s.button} disabled={isLoading} type='submit'>
                            {dict.button}
                        </button>
                        <DeleteAcc dict={dict}/>
                    </div>
                    {errors.username || errors.error || errors.about_me ? (
                        <p className={s.error}>{errors.username || errors.error || errors.about_me}</p>
                    ) : null}
                </div>
                
            </form>
        </>
    )
}
