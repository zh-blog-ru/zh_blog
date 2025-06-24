import React, { useState } from 'react';
import styles from './PrivacyCheckbox.module.css';
import { DictionaryType } from '@/i18n/getDictionary';
import LocalizedLink from '@/i18n/routes/LocalizedLink';

export default function PrivacyCheckbox({
  errors,
  onChange,
  dict
}: {
  errors?: string[],
  onChange: React.Dispatch<React.SetStateAction<boolean>>,
  dict: DictionaryType['blog']['reg']['politic']
}) {
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    onChange(e.target.checked)
  };

  return (
    <div className={styles.checkboxContainer}>
      <div className={styles.checkboxWrapper}>
        <input
          type="checkbox"
          id="privacyCheckbox"
          className={styles.checkbox}
          checked={isChecked}
          onChange={(e) => handleChange(e)}
          required
        />
        <label
          htmlFor="privacyCheckbox"
          className={styles.label}
        >
          {dict.agree} <LocalizedLink href="/terms">{dict.terms_of_use}</LocalizedLink> {dict.and} <LocalizedLink href="/privacy">{dict.privacy_policy}</LocalizedLink>
        </label>
      </div>
      <ul className={styles.errors}>
        {errors ?
          errors.map((error, index) => (
            <li key={index}>
              {error}
            </li>
          ))
          : null}
      </ul>
    </div>
  );
};