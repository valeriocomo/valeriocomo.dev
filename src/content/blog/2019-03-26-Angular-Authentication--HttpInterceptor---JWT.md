---
title: "Angular Authentication: HttpInterceptor + JWT"
pubDate: 2019/03/26 9:20
author: "Valerio Como"
tags:
  - angular
  - authentication
  - http-interceptor
imgUrl: '../../assets/blog/2019-03-26-angular-authentication-http-interceptor-jwt/cover.png'
description: Come gestire l'autenticazione attraverso Json Web Token
---

### Angular Authentication: HttpInterceptor + JWT

#### Come gestire l'autenticazione attraverso Json Web Token

![](../../assets/blog/2019-03-26-angular-authentication-http-interceptor-jwt/cover.png)

Nei mesi passati ho lavorato allo sviluppo di un piccolo gestionale. Era un progetto *greenfield* e il team di sviluppo ha potuto scegliere la tecnologia da utilizzare. Questa applicazione web è stata sviluppata con Angular ed utilizza un API server implementato con *Laravel*.

Il team ha deciso di adottare lo standard *Json Web Token* ([JWT](https://en.wikipedia.org/wiki/JSON_Web_Token)) per gestire l’autenticazione, anche perchè Laravel rende l’integrazione davvero semplice utilizzando il package *Passport*.

![](../../assets/blog/2019-03-26-angular-authentication-http-interceptor-jwt/image1.png)

Carlo Lucarelli

Ma come direbbe [Carlo Lucarelli](https://it.wikipedia.org/wiki/Carlo_Lucarelli):

> “Ma questa è tutta un’altra storia”

O forse un altro blog post dedicato a Laravel e a Passport.

---

### JWT in Angular

Per gestire JWT in Angular è stata utilizzata la libreria sviluppata da [*Auth0*](https://auth0.com/)*,* installabile eseguendo il seguente comando:

```bash
npm i --save @auth0/angular-jwt
```

L’adozione di questo package è utile per gestire alcuni aspetti di questo standard, come ad esempio verificare la validità o la scadenza del token. Al termine dell’installazione, la libreria è stata configurata e la nostra applicazione era pronta per gestire i token di autenticazione. Suggerisco di seguire la [documentazione](https://www.npmjs.com/package/@auth0/angular-jwt) per integrarla correttamente in Angular.

#### Utilizzo di JWT

Creiamo un servizio e implementiamo una funzione che effettua una chiamata al server, allegando all’header della richiesta il token di autenticazione. Testiamo il tutto e la nostra web application è adesso in grado di effettuare chiamate HTTP con autenticazione. In un secondo momento implementiamo un altro metodo del servizio che effettua una chiamata HTTP utilizzando l’autenticazione. Tutto funziona. Refattorizziamo il servizio, mettendo a fattor comune frammenti di codice duplicato che gestiscono l’aggiunta del token all’header. Testiamo e tutto è ancora funzionante.

Successivamente, è stato creato un secondo servizio che conterrà altri metodi che effettuano chiamate al server, utilizzando lo stesso approccio utilizzato per il primo. Tutto funziona e siamo contenti. O quasi.

Allo stato attuale delle cose abbiamo una applicazione che funziona ma abbiamo creato *debito tecnico*. In sostanza, abbiamo duplicato la logica che gestisce l’aggiunta del token ad una richiesta HTTP, violando due principi di buona programmazione:

* *Don’t Repeat Yourself* (*DRY*), ovvero abbiamo una ripetizione di codice;
* *Single Responsability Principle (SRP,* la S dei principi *SOLID)*, ovvero il servizio che dovrebbe occuparsi di effettuare chiamate HTTP si occupa anche di gestire il token di autenticazione;

La soluzione che fa per noi ce la propone Angular e corrisponde ad una sua feature: **HttpInterceptor**.

### Http Interceptor

*HttpInterceptor* è una funzionalità che fa parte del package *HttpClient*. Se vuoi approfondire il funzionamento degli interceptor, ti consiglio di dare uno sguardo al mio blog [post](/blog/2019-03-20-angular-http-interceptor).

#### **Token Interceptor**

Abbiamo adottato il seguente servizio per aggiungere il token ad ogni richiesta HTTP, denominato per l’occasione *JwtInterceptor*.

L’adozione di questa soluzione ci consente di rispettare entrambi i principi di buona programmazione che avevamo tralasciato in precedenza:

* Non c’è duplicazione di codice (*DRY*);
* Ogni servizio si occupa di un solo aspetto (*SRP*);

#### **Ulteriori applicazioni**

Gli *HttpInterceptor* sono molto utili per governare diversi aspetti della autenticazione. Ad esempio, possono essere utilizzati per gestire le risposte 401 oppure per effettuare il refresh di un token scaduto.