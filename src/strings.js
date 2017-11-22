import LocalizedStrings from 'react-localization';


class LocalizedStrings2 extends LocalizedStrings {
    constructor(props) {
        super(props);
    }
    get(key, defaultValue) {
        const val = this[key];
        if (typeof(val) === 'undefined') {
            return typeof(defaultValue) === 'undefined' ? ('__MISSING__' + key + '__') : defaultValue;
        } else {
            return val;
        }
    }
}


const strings = new LocalizedStrings2({

    en: {},
    fi: {
        //welcome_message: "Tervetuloa Reactin maailmaan",

        // === Common strings
        Edit: "Muokkaa",
        OK: "Ok",
        Close: "Sulje",

        // === Entry browser
        No_Entry_Selected: "Ei tietuetta valittuna",


        // === Entry editor
        EditEntry_Format: "Muokkaa tietuetta: {0}",

        // Stock fields:
        EntryForm_title: "Otsikko",
        EntryForm_detail: "Yksityiskohdat",
        EntryForm_hostName: "Isäntänimi",
        EntryForm_userName: "Käyttäjätunnus",
        EntryForm_password: "Salasana",

        //EntryForm_Title: "Otsikko",
        //EntryForm_UserName: "Käyttäjätunnus",
        //EntryForm_Password: "Salasana",
        Failed_To_Save_Entry: "Tietueen tallentaminen ei onnistunut",


    }
});



export default strings;