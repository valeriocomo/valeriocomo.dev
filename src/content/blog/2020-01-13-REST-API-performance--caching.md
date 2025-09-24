---
title: "REST API performance: caching"
pubDate: 2020/01/13 9:20
author: "Valerio Como"
tags:
  - rest
  - performance
  - caching
imgUrl: '../../assets/blog/2020-01-13-rest-api-performance-caching/cover.png'
description: Implementare una REST API con cache utilizzando ETag e If-None-Match
---

### REST API performance: caching

#### Implementare una REST API con cache utilizzando ETag e If-None-Match

![](../../assets/blog/2020-01-13-rest-api-performance-caching/cover.png)

Qualche anno fa scrissi un blog post su come implementare un sistema di caching per una REST API. L'articolo originale è andato perso e lo ripropongo in una versione totalmente rivisitata.

### Scenario

All'epoca ero alle prese con lo sviluppo *from scratch* di una REST API. Le API in questione erano state progettate e realizzate per far interagire applicazioni mobile native con il core di una web platform. In breve, l'applicazione mobile effettuava una serie di chiamate *HTTP* per ricavare e salvare dati su un server. Anche se lo scenario è molto elementare, bisognava tenere in considerazione che le (limitate) risorse del server stesso dovevano essere preservate. Scelsi di adottare la soluzione più semplice, sfruttando le cache di *HTTP*.

#### HTTP Caching

Il protocollo *HTTP/1.1* implementa un meccanismo di caching standard. L'obiettivo del caching è evitare di restituire la stessa risposta dal server per la stessa risorsa, ottenendo di conseguenza i seguenti benefici:

* Riduzione utilizzo bandwidth
* Riduzione utilizzo server
* Nessuna latenza nell’acquisizione dei dati

#### Caching in REST

Il concetto di *caching* è centrale nel design di una architettura REST, anche se non tutti i verbi supportano il *caching*:

* *GET*: *cacheable* by design
* *POST*: non *cacheable* by design ma si può ovviare a ciò utilizzando degli specifici header *HTTP*.
* *PUT*: non *cacheable*
* *DELETE*: non *cacheable*

Il meccanismo di *caching* è gestito mediante l'utilizzo di una serie di *header HTTP*, attraverso i quali viene ottimizzata l'acquisizione dello stato della risorsa e viene gestito il salvataggio della stessa evitando conflitti.

### Conditional GET

Una *conditional GET* è un tipo di richiesta che ottiene una risposta differente a seconda del verificarsi di una condizione. Questa condizione è definita mediante specifici *header*. Per implementare una richiesta condizionale è necessario utilizzare gli *header* qui elencati:

* *etag*
* *if-none-match*

#### ETag

**etag**, abbreviazione di *Entity Tag*,è un *header* allegato ad una risposta ottenuta dal server. Il valore di un *etag* è una stringa, generata come risultato di un *hashing* o di un *fingerprint* della risorsa ottenuta. Questa stringa deve essere memorizzata dal client in relazione alla risorsa e riutilizzata al momento di una successiva richiesta della medesima.

![](../../assets/blog/2020-01-13-rest-api-performance-caching/image1.png)

Response header con etag

#### **If-none-match**

**if-none-match** è un *header* allegato alla richiesta di una risorsa, in genere utilizzando il verbo *GET*. Il valore allegato è il medesimo *etag* relativo alla medesima risorsa, ottenuto da una precedente interazione col server.

All’atto di una nuova richiesta, il server effettuerà il match tra il valore ricevuto in *if-none-match* e quello calcolato sulla risorsa.

Se i valori confrontati sono uguali, allora la risorsa non è stata modificata. Il server restituirà una *response* vuota e con stato *304 Not Modified*. Questo status code indica al consumer della API che la risorsa non è stata modificata e che può utilizzare la versione in cache.

![](../../assets/blog/2020-01-13-rest-api-performance-caching/image2.png)

Request header con if-none-match

Se il match da un esito negativo, allora il server restituirà la nuova rappresentazione della risorsa e il nuovo valore allegato ad *etag*.

### BONUS: Update simultaneo di una risorsa

Cosa accadrebbe se due utenti volessero modificare lo stato di una risorsa contemporaneamente?

L’utilizzo di *if-match* consente di gestire questa casistica.

#### If-match

**if-match** è un *header* allegato alla richiesta *HTTP* e serve a verificare una precondizione.

In un contesto *REST*, l'utilizzo congiunto di questo *header* consente di individuare *mid-air collision*, ovvero verificare che l'aggiornamento dello stato di una risorsa sia avvenuto a partire dalla ultima versione della stessa.

Il valore contenuto in *if-match* è l’*etag* relativo alla risorsa. All’atto della richiesta, il server effettuerà un match tra il contenuto di questo header e quello relativo allo stato della risorsa.

Se i valori confrontati non sono uguali, allora il server restituirà una response con status code *412 Precondition failed*, impedendo l’aggiornamento dello stato della risorsa.

![](../../assets/blog/2020-01-13-rest-api-performance-caching/image3.png)

Request header con if-match

Se i valori confrontati sono uguali, la modifica è stata effettuata a partire dalla versione più recente, aggiornando la risorsa.

### **Wrap up**

In breve, per implementare un sistema di caching per una *REST API* non è necessario reinventare la ruota. Il protocollo *HTTP* offre tutti gli strumenti utili per fare ciò. L’utilizzo di alcuni header consente di gestire lo stato di una risorsa:

* *etag*
* *if-none-match*
* *if-match*

L'utilizzo degli header sopraelencati consente l’implementazione di richieste condizionali, *Conditional GET*, andando ad ottimizzare una serie di aspetti:

* utilizzo della banda
* server loading (numero minore di letture dal database)
* latenza (interazione con il server più rapide)