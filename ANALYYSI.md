1. Mitä tekoäly teki hyvin?

- Sanoisi, että tekoäly sai ihan siedettävän ekan version, vaikka yhden korjauksen piti pyytää sen tekemään koodin. Ja miksi sen sain niin hyvin tehtyä sen, olen tehnyt prompttin, joka antaa yleensä aikan hyvin yhdellä promptilla.

2. Mitä tekoäly teki huonosti?

- Tieto ei ole aina ajantasalla, niin pitää välillä mennä lukemaan dokumentaatiota, että pystyy korjaamaan ongelman.

3. Mitkä olivat tärkeimmät parannukset, jotka teit tekoälyn tuottamaan koodiin ja miksi?

- Itse haluasin, että Delete palauttaan statuskoodin 200 mielummin, kun statuskoodi 204, jota saisin { id:"123", deletedAt: "2026-02-16..."} tai {message: "booking cancelled with success"}. Ensimmäisen silloin, jos on tietokanta, jos haluaa käyttäjällle näyttää, että tämä aika vapautui jne.
- Lisäsin /openapi-endpointin, josta saa JSON-muodossa rajapinnan OpenAPI-kuvauksen. Tämä taas ei niin hyödyllinen, ainakaan näin pienessä rajapinnassa vielä ainakaan omasta mielestäni. Mutta helpottaa, rajapinnan testaamisen ja dokumentoinnissa.
