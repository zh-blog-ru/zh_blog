# Mastering Internationalization in Next.js

Learn how to easily add internationalization (i18n) to your Next.js web application and delight users with an accessible interface in their native language!

▌What is Internationalization and Why is it Important?

Internationalization (i18n) is the process of designing and developing web applications in a way that they can be easily adapted for various languages and regions. Simply put, it's preparing your application to be used by people all over the world, regardless of their language.

Why is i18n important?

-  Expand Your Audience: By offering an interface in the user's native language, you significantly increase your audience reach.
-  Improve User Experience: People prefer to use applications in a language they understand. This increases user engagement and satisfaction.
-  Increase Conversion Rates: A more comfortable and understandable interaction with the application leads to increased conversion rates and achievement of business goals.

▌Preparing Your Next.js Project for Internationalization

Next.js offers several ways to implement i18n. Here, we will explore one of the most popular and flexible approaches using built-in routing capabilities and components.

▌Step 1: Configure next.config.js

The first step is to configure the next.config.js file. Add an i18n section with a list of supported locales (languages) and a default locale.


```javascript prettier
// next.config.js
module.exports = {
 i18n: {
  locales: ['en', 'ru', 'es', 'de'], // List of supported languages
  defaultLocale: 'en', // Default language
 },
}
```

-  locales: An array of strings representing supported language codes (e.g., 'en' for English, 'ru' for Russian).
-  defaultLocale: The language code that will be used if the user does not specify a preferred language (e.g., through browser settings).

▌Step 2: Create Localization Files

For each supported language, you need to create a file containing text translations. These files are usually stored in a folder, such as locales.


```
/locales
 /en.json
 /ru.json
 /es.json
 /de.json
```

Example of locales/en.json:


```json
{
 "greeting": "Hello",
 "welcomeMessage": "Welcome to our website!"
}
```

Example of locales/ru.json:


```json
{
 "greeting": "Привет",
 "welcomeMessage": "Добро пожаловать на наш сайт!"
}
```

▌Step 3: Use useRouter to Determine the Locale

In Next.js components, you can use the useRouter hook from next/router to get the current locale.


```javascript
import { useRouter } from 'next/router';

function MyComponent() {
  const router = useRouter();
  const { locale } = router;

  return (
    <p>Current locale: {locale}</p>
  );
}

export default MyComponent;
```

▌Step 4: Load and Use Translations

There are several ways to load and use translations in Next.js. One of the easiest is to use getServerSideProps or getStaticProps to load JSON localization files.

Example using getStaticProps:


```javascript
import { useRouter } from 'next/router';
import en from '../locales/en.json';
import ru from '../locales/ru.json';
import es from '../locales/es.json';
import de from '../locales/de.json';

const translations = {
  en,
  ru,
  es,
  de
};

function HomePage({ translations }) {
  const router = useRouter();
  const { locale } = router;

  return (
    <div>
      <h1>{translations.greeting}</h1>
      <p>{translations.welcomeMessage}</p>
    </div>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      translations: translations[locale] || translations['en'], // fallback to english if locale not found
    },
  };
}

export default HomePage;
```

Code Breakdown:

•  Import the localization files (en.json, ru.json, etc.).
•  Create a translations object that contains all imported files.
•  In the HomePage function, get the locale from the router and pass the corresponding localization file as the translations prop.
•  The getStaticProps function loads the correct localization file depending on the current locale. If the locale is not found, the default localization file is used (in this example, English).
•  In the component, use the translations from the translations object to display the text.

▌Step 5: Create a Language Selection Component

For user convenience, you need to provide them with the ability to switch the interface language. You can create a component that displays a list of available languages ​​and redirects the user to the page with the selected locale.


```javascript
import Link from 'next/link';
import { useRouter } from 'next/router';

function LanguageSwitcher() {
  const router = useRouter();
  const { locales, locale } = router;

  return (
    <div>
      {locales.map((loc) => (
        <Link href={router.asPath} locale={loc} key={loc}>
          <button disabled={locale === loc}>{loc}</button>
        </Link>
      ))}
    </div>
  );
}

export default LanguageSwitcher;
```

Code Breakdown:

•  Import the Link and useRouter components.
•  Get the list of available locales (locales) and the current locale (locale) from router.
•  Create a list of buttons for each language.
•  When a button is clicked, the Link component redirects the user to the same page, but with a new locale.
•  The current locale button is disabled (disabled={locale === loc}).

▌Advanced Topics

•  Using i18n Libraries: There are libraries like next-i18next that simplify the internationalization process in Next.js and provide additional features such as lazy loading translations and formatting numbers and dates.
•  Dynamic Locale-Specific Paths: Next.js allows you to dynamically create pages with different locales (e.g., /en/about, /ru/о-нас).
•  SEO and i18n: It's important to configure meta tags and hreflang attributes for each locale so that search engines can properly index your site.

▌Conclusion

Internationalization is an important step in creating web applications that are accessible to a wide audience. Next.js provides convenient tools for implementing i18n, allowing you to easily adapt your application for different languages ​​and regions. By following the steps described in this article, you can create a multilingual website that will delight your users.