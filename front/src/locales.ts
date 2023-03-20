// For demo purposes we are adding all locales, you SHOULD NOT DO THIS IN PRODUCTION
import { configure } from "vee-validate";
import { localize, setLocale } from "@vee-validate/i18n";
import { codes } from "./lang-codes";
import fr from '@vee-validate/i18n/dist/locale/fr.json';

(async() => {

    configure({
        generateMessage: localize({
         fr
        }),
      });
    // const locales = await Promise.all(
    //     codes.map((code) =>
    //         import (`@vee-validate/i18n/dist/locale/${code}.json`))
    // );

    // const dictionary = locales.reduce((dict, curr, idx) => {
    //     const code = codes[idx];
    //     dict[code] = curr;

    //     return dict;
    // }, {});

    // configure({
    //     generateMessage: localize(dictionary)
    // });

    // setLocale("fr");
})();