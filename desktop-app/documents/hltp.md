# High-level testing plan

## Intro

### Projekti lyhyesti

FindE on mobiilisovellus, joka on suunniteltu tarjoamaan nopeaa ja vaivatonta markkinointia monenlaisten tapahtumien yhteydessä. Sovelluksen tarkoituksena on helpottaa tapahtumien järjestäjien ja potentiaalisten osallistujien kohtaamista. Sovelluksen toiminta perustuu kahteen keskeiseen käyttäjäryhmään: ylläpitäjät ja peruskäyttäjät. Ylläpitäjät voivat syöttää tapahtumat sovellukseen, kun taas peruskäyttäjät saavat ilmoituksia syötetyistä tapahtumista.

Sovelluksessa korostuu karttatoiminnallisuuden ja sijaintipohjaisten ominaisuuksien hyödyntäminen. Tavoitteena on tarjota käyttäjille mahdollisuus paikantaa tapahtumat kartalta ja saada tietoa lähellä olevista kiinnostavista tapahtumista. Lisäksi sovelluksessa pyritään mahdollistamaan navigointi suoraan tapahtumapaikalle saman sovelluksen sisällä, mikäli se on toteutettavissa teknisten mahdollisuuksien puitteissa.

### Tarkoitus

High level testing plan dokumentin tarkoituksena on auttaa organisoimaan ja koordinoimaan testausprosessia ja varmistamaan, että testaus kattaa tarvittavat osa-alueet samalla varmistaen tuotteen riittävän laadun sekä toimivuuden.

## Testistrategia

Testausstrategiamme keskittyy vahvasti vaatimusten pohjalta suunniteltuun testaukseen. Testit suunnitellaan ja toteutetaan tiiviisti ohjelmistovaatimusten perusteella varmistaen tällöin niiden täyttymisen.

Projektin kehittäjät ottavat vastuun yksikkötestien laatimisesta omalle koodilleen. Tämä käytäntö korostaa yksittäisten kehittäjien vastuuta ohjelmiston laadunvarmistuksessa ja testauksessa. Kunkin kehittäjän odotetaan suunnittelevan ja toteuttavan yksikkötestit huolellisesti omalle koodilleen varmistaakseen sen toimivuuden.

Sovelluksen valmistuessa voimme siirtyä End-toEnd testaamisen pariin, jossa isoissa osassa on End-toEnd testaukseen tarkoitettu työkaulu Cypress. Hieman poikkeavasti sovelluksessamme on webbi versio sekä mobiiliversio, joka tarkoittaa sitä, että Cypressiä voidaan hyödyntää ainoastaan webbisovelluksen testaamiseen. Mobiilisovelluksen End-to-End testaukseen käytettävä frameworkki on vielä toistaiseksi päättämättä, mutta tulemme tekemään päätöksen pian.

Sovelluksen ollessa käyttö valmiina siirrymme manuaalitestaukseen, jossa käyttäjä saa käyttää sovellusta ja antaa siitä palautetta. Näin kerkeämme tarvittaessa vielä ennen julkaisua tekemään muutoksia sovelluksen toimintaan ja sen käytettävyyteen.

### Test items

| Svelte Front            | Angular Front      | Backend          |
| ----------------------- | ------------------ | ---------------- |
| Rekisteröinti           | Rekisteröinti      | Tietokantayhteys |
| Kirjautuminen           | Kirjautuminen      | Modelit          |
| Tapahtuman lisääminen   | Tapahtumat         | Controllerit     |
| Tapahtuman poistaminen  | Kartan toiminta    | Reitit           |
| Tapahtuman muokkaaminen | Sijainnin toiminta | Reittien suojaus |

### Test tasks

1. Rekisteröinti
   - **Svelte** sekä **Angular** frontendien käyttöliittymän rekisteröintitoiminnallisuus testataan simuloimalla käyttäjän interaktiota ja varmistetaan, että rekisteröintilomake toimii odotetulla tavalla.
   - **Backend** puolella rekisteröintilogiikkaa testataan varmistamalla, että tiedot tallentuvat tietokantaan oikein ja rekisteröinti toimii.
2. Kirjautuminen
   - **Svelte** sekä **Angular** frontendien käyttöliittymän kirjautumistoiminnallisuus testataan simuloimalla käyttäjän sisään kirjautumista ja samalla varmistetaan, että se toimii odotetulla tavalla.
   - **Backend** puolella kirjautumislogiikkaa testataan varmistamalla, että tiedot haetaan tietokannasta oiken ja kirjautuminen onnistuu jos sähköposti sekä salasana ovat oikein.
3. Tapahtuman lisääminen, muokkaaminen ja poistaminen
   - **Svelte** frontendissä testataan tapahtuman lisäämistä käyttöliittymän kautta varmistaen, että tapahtuman tiedot syötetään onnistuneesti. Lisäksi testataan tapahtuman poistamista käyttöliittymästä ja varmistetaan, että poisto toimii odotetusti. Samoin testataan myös tapahtuman muokkaamista käyttöliittymässä ja varmistetaan, että muokkaus toimii oikein.
   - **Backend** puolella tapahtuman lisäämistä, muokkaamista ja poistamista testataan varmistamalla, että tiedot päivittyvät tietokantaan oikein.
4. Tietokantayhteys
   - Tietokantayhteyden toimivuutta testataan backend-puolella yksikkötesteillä, joissa varmistetaan yhteys tietokantaan ja sen toimivuus.
5. Modelit ja Controllerit
   - **Modeleita** testataessa varmistetaan, että ne ottavat vastaan vain oikean muotoista dataa sekä toimivat tietokannan kanssa odotetulla tavalla.
   - **Controllerien** testauksessa keskitytään varmistamaan, että ne käsittelevät HTTP-pyyntöjä ja vastauksia odotetulla tavalla. Lisäksi testauksessa keskitytään varmistamaan, että jokainen controllerin metodi toimii odotetulla tavalla ja tuottaa odotetut tulokset.

### Testattavat ominaisuudet

1. **Uuden käyttäjän rekisteröinti**, varmistetaan, että uuden käyttäjän luominen onnistuu ja käyttäjätieto on kaikilta osin validia.
2. **Käyttäjän sisään kirjautuminen**, varmistetaan, että käyttäjä sisään kirjautuminen onnistuu niin paikallisilla tunnuksilla, kuin google tunnuksilla.
3. **Tapahtuman lisääminen, muokkaaminen ja poistaminen**, varmistetaan, että perus toimenpiteet lisääminen, muokkaaminen ja poistaminen onnistuvat. Samalla varmistetaan, että lisättäessä ja muokattaessa tieto on validia.
4. **Kartan toiminta**, varmistetaan, että sovelluksessa oleva kartta sekä siihen integroitu reaaliaikainen sijainti toimii asianmukaisella tavalla.

### Ei testattavat ominaisuudet

Tulemme julkaisemaan sovelluksen backendin AWS Elastic Bean Stalkissa, joka on AWS:n tarjoama ratkaisu backend:in hostaamiselle. Emme koe tarpeellisena lähteä testaamaan Elastic Bean Stalkin toiminnallisuutta tai tietoturvaa, johtuen osaksi aikahaasteista mutta myös AWS:n yleisestä luotettavuudesta. Lisäksi tulemme käyttämään S3 buckettia kuvien tallentamiseen, jonka toimintaa emme myöskään aio testata, edeltä mainituista syistä.

### Lähestymistapa

Testaus käynnistyy välittömästi projektin kehitystyön alussa, jolloin jokainen kehitystiiminjäsen aloittaa yksikkötestien laatimisen koodiinsa jo kehitystyön alkumetreistä asti.

Projektin edetessä siirrymme vaiheeseen, jossa toteutetaan laaja-alaisempaa testausta, jossa keskeisenä testausmenetelmänä on End-to-End testaus. End-to-End testauksessa pyrkimme simuloimaan ja testaamaan käyttäjän kokemusta sovelluksesta kokonaisvaltaisesti.

Yksi merkittävä työkalu E2E-testauksen toteuttamisessa on Cypress, jonka avulla on mahdollista simuloida ja testata käyttäjän kokemusta käyttöliittymästä. Sovelluksestamme on olemassa webbi versio sekä mobiiliversio, jonka vuoksi Cypressiä voidaan hyödyntää ainoastaan webbiversioissa.

### Hyväksymiskriteerit

Vähimmäisvaatimusten täyttyminen vaati sen, että sovellukseen on mahdollista kirjautua onnistuneesti sekä rekisteröidä uusi käyttäjä. Sovelluksessa tulee myös pystyä lisämään, muokkaamaan ja poistamaan tapahtumia. Lisäksi käyttäjän tulee nähdä mobiilisovelluksessa olevia tapahtumia, sekä pystyä lisäämään niitä suosikiksi ja poistamaan suosikeista.

### Testauksen keskeytys ja jatkaminen

Testaus voidaan keskeyttää välittömästi, jos testauksen aikana havaitaan vakava virhe, joka estää sovelluksen perustoiminnallisuuden tai aiheuttaa merkittäviä ongelmia. Tällöin keskitytään virheen korjaamiseen ja tarvittaessa aloitetaan välittömät toimenpiteet virheen ratkaisemiseksi ennen testauksen jatkamista. Testaus voidaan myös tarvittaessa lopettaa jos tärkeimmät testit ovat suoritettu ja ne ovat läpäisseet, saatetaan päättää, että lisätestauksen suorittaminen ei tuota enää merkittävää lisäarvoa.

## Tuotokset

Yksikkötestauksen aikana kehitystiimin ulkopuolelle tuotoksia ei suuremmmissa määrin ole tulossa. End-to-End testaukseen siirryttäessä voimme näyttää Cypressisstä löytyviä logeja tai vastaavasti demota, sovelluksen toimintaa. Manuaalitestauksesta tulemmme kirjoittamaan pienien raportin, josta käy ilmi käyttäjän käyttökokemus sekä yleinen mielipide sovelluksesta.

## Ympäristö

Testauksen aikana käytämme erilaisia työkaluja ja ympäristöjä testien suorittamiseen. Yksikkötesteissä hyödynnämme Mocha- ja Chai-kirjastoja, koska ne ovat kaikille kehitystiimin jäsenille jo ennestään tuttuja. End-to-end -testeissä tulemme hyödyntämään Cypressiä testiympäristönä. Cypress on valittu työkaluksi, koska se tarjoaa kattavan ja tehokkaan ratkaisun End-to-End -testauksen suorittamiseen, lisäksi sen on myös entuudestaan tuttu testaajalle.

## Velvollisuudet/vastuut

Koko kehitystiimillämme on velvollisuus pitää huolta, että sovellus toimii ja on turvallinen kaikille sen käyttäjille. Tämän varmistamme sillä, että jokainen kehitytiimin jäsen testaa kaiken kirjoittamansa koodin yksikkötestejä hyödyntämällä. Testaajan vastuulla on suorittaa end-to-end testejä sovellukseen siinä vaiheessa, kun niitä on mahdollista alkaa suorittamaan.

## Osaaminen ja sen hankinta

Kehitystiimistä löytyy ohjelmointiosaamista, mikä vähentää merkittävästi haasteita yksikkötestien laadinnassa. Kehitystiimin jokaisella jäsenellä on myös jonkin verran kokemusta Cypress-työkalun hyödyntämisestä, mikä toimii positiivisena lähtökohtana E2E-testauksen aloittamiselle. On kuitenkin todennäköistä, että tulemme tarvitsemaan konsultaatiota erilaisten testitapauksien kanssa, jota on mahdollista saada testaustiimin yhteisissä tapaamisissa.

## Aikataulut

Testaus alkaa välittömästi kehitystyön alussa yksikkötesteillä, joka käytännössä tarkoittaa sitä, että jokainen kehitystiimin jäsen tekee omat yksikkötestit omaan koodinsa. Sovelluksen ollessa valmiina End-to-End testaukseen siirrytään tekemään End-to-End testejä Cypress työkalulla. Tarkkaa aikataulua on vielä mahdotonta sanoa tässä vaiheessa sovelluksen ollessa vasta kehitystaipaleensa alussa. Testauksen alustavaa aikataulutusta on karkeasti mietitty alla olevassa taulukossa.

| Testaustapa     | Testauksen aloitus | Testaus valmis |
| --------------- | ------------------ | -------------- |
| Yksikkötestaus  | 18.9.2023          | (24.11.2023)   |
| End-to-End      | 2.10.2023          | (24.11.2023)   |
| Manuaalitestaus | 2.10.2023          | (27.11.2023)   |

## Riskit

Suurimpana riskinä on, että yksikkötestien laatimista sekä niiden käyttämistä laiminlyödään, jonka vuoksi sovellus ei tule välttämättä läpäisemään End-to-End ja manuaalitestausta.

## Oletukset ja riippuvuudet

Oletamme, että sovelluksen testaaminen tulee onnistumaan ilman suurempia ongelmia, koska ryhmässämme on riittävästi testaus osaamista. Toivottuun lopputulokseen pääseminen vaatii kaikilta kehitystiimin jäseniltä pitkäjänteistä työtä testauksen parissa.
