# Build a PWA with Angular

In this tutorial, I will you through step by step to build a Progressive Web Application using Angular. PWA are performance focused web applications that are especially streamlined for a mobile device. They can be saved over a device's Home/App screen and try to implement a native app feel and look. The first PWA app I used on my mobile device is the Lite Twitter one which got released almost an year back. Here is the link if you want to try: [https://lite.twitter.com/](https://lite.twitter.com/). They even support push notifications and offline support these days.

A Progressive Web App can have similar capabilities that of a native application. Mobile devices that run Android already have powerful web browser Google Chrome pre-installed. Leveraging it, a PWA app can provide similar experience that of a native application with difference that a PWA app will run in the browser. Not only Google Chrome but any browser that supports them. Nowadays, a few PWA applications such as Twitter Lite or Facebook Lite have started to appear on the app stores.

Another notable difference between a PWA app and a native mobile application is that a PWA is deployed and accessible from web servers using a URL. Most PWA apps still work like that. To follow along with this tutorial, you are going to need two things.

- Angular command line utility called `@angular/cli`. I am using version `6.1.2`.
- [Lighthouse](https://developers.google.com/web/tools/lighthouse/) Chrome Extension

That's all you need to build a PWA and to understand this tutorial. So let us begin.

## Installing Lighthouse

Lighthouse is an open-source tool created by Google which is used to audit websites and applications alike for accessibility performance, PWA features and SEO. There are various ways to run this tool such as from command line or as a browser extension. It runs a series of audits against the URL of your application and on completion, generates a report on how well the page did. It also provides with each audit a reference to the documentation explaining what the audit is about and how to fix it in case of failure. You can then share these auditing reports in many ways such as in JSON format or as Github Gists.

Below is an example of how Lighthouse generates an auditing report.

(ss1)

To install this tool, I am going to add it as a Chrome Extension. You can download it [here](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk/related). Once installed, you will notice that a new icon appears in the extension bar like below.

(ss2)

With that installed, we can now move ahead and installed our next necessary tool.

## Installing Angular CLI

In this section, I am going to show you how to install Angular cli and then generate a project. Open your terminal.

```shell
npm install -g @angular/cli
```

Please note that, Angular-CLI requires you to have a Nodejs installed with a version equal or greater to `8.9.x`. Make sure you have the required version or above. To check which node version you currently have on your local machine, you can run `node -v` command.

After the `@angular/cli` has installed successfully, let us generate a new project. Run the following command and traverse into the newly created project directory.

```shell
ng new ng-pwa-demo
```

This will create a project that has a structure looking like below.

(ss3)

## Creating The Application

In the previous section we generated our project directory so now let us run the default boilerplate application that comes with `@angular/cli`. Run the below command from your terminal.

```shell
npm start
```

The default app will run on URL: `http://localhost:4200`. See the below screenshot.

(ss4)

This verifies that everything from npm has installed correctly.

### Setup an HTTPClient

Now let us setup our Angular app to make it work first before I show you how to audit it with Lighthouse. We are going to consume a third party API and to integrate that API we are going to use `HttpClientMOdule` to send the HTTP requests. Import the module in the application inside the file `src/app/app.module.ts`.

```js
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

This enables us to inject and use `HttpClient` in any Angular component in our app.

### Creating a Service

Let us create a service that will fetches the data from a third party API that we are going to use in our Angular app. To create a new service from command line please type the below in your console or temrinal.

```shell
ng g service api
```

The `g` flag stands here for _generate_. This create two new files inside `src/app`. We need to work with `api.service.ts`. Edit the file and add the below code. Inside this file, we start by importing `HttpClient`.

```js
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Item {
  title: string;
  url: string;
}


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private dataURL: string = 'https://api.hnpwa.com/v0/news/1.json';

  constructor(private httpClient: HttpClient) {}

  getData(): Observable<Item[]> {
    return <Observable<Item[]>this.httpClient.get(this.dataURL);
  }
}
```

Then we inject an `Observable` from the library `rxjs` (which stands for Reactive Extensions for JavaScript). This provides us to to handle asynchronous calls to the API from our app. We can use it with HTTP module to handle AJAX requests. This is common programming pattern among Angular developers and is called Reactive Programming.

`rxjs` library is providing us the ability to use `Observable` as the part of the JavaScript language and unil it becomes a native type of the language itself.

After importing the necessary dependencies, declare an `Item` interface that represents a single item of the returned JSON data. For the demonstration purpose I am using the **Hacker News API**. It is CORS enabled so you do not have to worry about that. The API gives a lot of data but we only need few things from it. You can test the API URL `https://api.hnpwa.com/v0/news/1.json` in any REST client to see what are the results.

(ss5)

To create an injectable service class, we use the syntax `@Injectable`. Inside it we provide `providedIn: 'root'` to tell the Angular app that this service we are declaring is created by the app root injector.

The function `getData()` above uses `HttpClient` injected in the constructor as `httpClient`. It calls the `get()` method of `HttpClient` for sending an HTTP GET request to the JSON endpoint. Further, it returns an observable that we are going to use in the next to subscribe to it.

### Consuming the Service

Open the file `app.component.ts` and import the `ApiService` like below.

```js
import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { Item } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ng-pwa-demo';
  items: Array<Item>;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.apiService.getData().subscribe(
      (data: Array<Item>) => {
        console.log(data);
        this.items = data;
      },
      err => {
        console.log(err);
      }
    );
  }
}
```

As you can notice we are also importing the class interface `Item` from the `api.service.ts` file. Every component in Angular has a life-cycle. Angular creates, renders the component as well as create and render a component's children before removing it from DOM. `ngOnInit` and `OnInit` represent the life-cycle hook that handles the fetching of data from the API after the `AppComponent` is initialized.

`fetchData()` is the function that calls the `getData()` function defined in the file `api.service.ts`. You can notice that since `getData()` returns an observable, and further allows us to subscribe to whatever result it comes with inside `fetchData()`. Finally, we are assigning the data to items array.

### The Application UI

The purpose of this tutorial is to teach the concepts that leads to building a PWA using Angular. Our app might not look so good, and since it is only a demo, I am going to keep it that way for brevity. I am not going to use any third party UI library. However, you can make it look as awesome as you want or use a third party library if you want to.

In the previous section we wrote the code for fetching the data from the API endpoint but how do we know that the data is being fetched? Well, if you have noticed, I did add one `console` statement to see if we are getting the data. Open Chrome browser and make the `npm start` command is running from your terminal. Go to Developer Tools and go to _Console_ tab.

You can clearly see, if there are no errors that the data is being fetched successfully.

(ss6)

(ss7)

We only need a few fields as we defined in the class interface `Items`. However the API endpoint gives all data fields that you can use to build a complete HackerNews app!

Open up `app.component.html` add the following markup.

```html
<div style="text-align:center" class="header">
  <h1>
    Welcome to HN PWA Demo
  </h1>

</div>
<h2 class="subtext">Here are some links to Start Your Day:</h2>
<ul *ngFor="let item of items" class="title">
  <li>
    <h2><a href={{item.url}}>{{item.title}}</a></h2>
  </li>
</ul>
```

The incoming data from the JSON API endpoint is in an array of objects. To display the fields such as title of the post and the URL, we are going to traverse the array using `*ngFor*` as the attribute to the unordered list element. I am also adding basic CSS styles so do add them inside `app.component.css`.

```css
.subtext {
  font-family: 'Lucida Grande', 'Segoe UI', Arial, Helvetica, sans-serif;
  font-size: 11px;
  height: 20px;
  vertical-align: top;
}

.title {
  color: #ccc;
  font-family: 'Lucida Grande', 'Segoe UI', Arial, Helvetica, sans-serif;
  font-size: 16px;
}

a {
  text-decoration: none;
  color: #000000;
}

a:hover {
  text-decoration: underline;
}

body {
  margin: 0;
}

.header {
  background-image: -webkit-linear-gradient(top, #f60, #f70);
  border-bottom: solid 1px #f60;
  box-shadow: 0 2px rgba(0, 0, 0, 0.1);
  align: center;
  padding: 5px;
  font-family: 'Lucida Grande', 'Segoe UI', Arial, Helvetica, sans-serif;
}

body
  > center
  > table
  > tbody
  > tr:first-child
  > td
  > table
  > tbody
  > tr
  > td:first-child {
  padding-right: 10px;
}

body
  > center
  > table
  > tbody
  > tr:nth-child(3)
  > td
  > table
  > tbody
  > tr:first-child
  > td:nth-child(2).title
  > a {
  font-size: 18px;
}

ul {
  font-family: 'Lucida Grande', 'Segoe UI', Arial, Helvetica, sans-serif;
  font-size: 15px;
}

li a {
  text-decoration: none;
  color: #4d4d4d;
}
```

We only need one component file for our app since there is not much going in our app UI wise. If you take a look at the `http://localhost:4200` you will see something similar.

(ss8)

Our demo app is ready, now all we need is to convert it into a Progressive Web Application.

## Building the PWA

After building the web application when you start to convert it to a Progressive Web App, you will have to build for production. Most PWA features are not compatible in development mode. You cannot trigger the execution of service workers, caching, etc. To build our current Angular application for production all we have to run is the following command from the terminal.

```shell
ng build --prod
```

This will create a `dist/ng-pwa-demo/` directory in the root of our Angular project. We will use an npm tool like **serve** to the serve the content inside the dist folder without setting up the backend. Install this tool from npm.

```shell
npm install -g serve
```

Then traverse into `dist/ng-pwa-demo/` from the terminal and type the below command.

```shell
serve
```

From the web browser you can navigate to `http:localhost:5000/` to see the result. Now let us first audit and see what is missing or what steps we need to take to convert this app into a PWA.

Go to the developer tools in the Chrome Browser and click on the `Audits` panel. First choose `Mobile` instead of Desktop and then choose `Progressive Web App` option only. Uncheck everything else as we are going to run the audit only for a PWA. Lastly, hit the `Run audit` button. Once the process of auditing is complete, it will generate report and showcase it to you like below.

(ss9)

Lighthouse performs various checks to validate different aspects of a Progressive Web App. These aspects and more details about each of them are mentioned at [PWA Checklist](https://developers.google.com/web/progressive-web-apps/checklist). This guide not only covers the basics and details about the different PWA terminology but also offers a way to fix them.

(ss10)

We are getting an initial score of 46 and four of the audits are currently being passed. Our Angular app currently fails in 7 other audits related to no value of brand theme color provided, registration of a service worker, redirect from HTTP traffic to HTTPS, etc.

Angular CLI allows you to add PWA features to an existing application by runing a simple command from the terminal described below.

```shell
ng add @angular/pwa
```

This command automatically add basic configuration required for an angular app to turn into a PWA and starts by creating a new file called `manifest.json`, adding different sizes of icons as assets and registering a service worker inside the file called `ngsw-config.json`. After that, run the production build command again.

```shell
ng build --prod
```

This command will register and include all the necessary files inside the `dist` directory. A `manifest.json` file looks like below.

```json
{
  "name": "ng-pwa-demo",
  "short_name": "ng-pwa-demo",
  "theme_color": "#1976d2",
  "background_color": "#fafafa",
  "display": "standalone",
  "scope": "/",
  "start_url": "/",
  "icons": [
    {
      "src": "assets/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "assets/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "assets/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "assets/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "assets/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "assets/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "assets/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "assets/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

This is how our latest `dist` directory looks like.

(ss11)

To change the icons or assets related to our PWA, you can always traverse to `assets/icons` folder in the `src` directory. After you have added your own app icons for the sizes mentioned inside the `manifest.json` file you can run the `ng build` command again.

The `ngsw-worker.js` file contains the service worker. To insert the service worker and let our angular app know about its existence is present and appended when we converted the command to turn our angular app into a PWA inside `src/app/app.module.ts` file.

```js
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
// NEW LINE ADDED BY @angular/pwa
import { ServiceWorkerModule } from '@angular/service-worker';
// NEW LINE ADDED BY @angular/pwa
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    // NEW LINE ADDED BY @angular/pwa
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

Angular also installs two new dependencies which you can find inside the `package.json`.

```json
"dependencies" :{
  "@angular/pwa": "^0.10.2",
  "@angular/service-worker": "^6.1.0",
  [...]
}
```

The service worker is automatically enabled inside the file `angular.json` which contains the configuration information from the start, when we created this application. Also, inside `dist/ng-pwa-demo/index.html` file you will find two lines added.

```html
<link rel="manifest" href="manifest.json">
<meta name="theme-color" content="#1976d2">
```

The manifest attribute is linking the `manifest.json` and `index.html`. The theme color tells the browser to show which color such as in the address bar. You see how much PWA configuration Angular CLI takes care of with just one command. Imagine, adding all that details manually in every file we have seen or mentioned in this section. I can say for myself, I will surely miss something or other until the next audit breaks or fails. With that, now let us run another audit and see how far we have reached. This is the latest audit report I have generated.

(ss12)

11 audits are being passed! The only one which is failing right now is related to HTTPS. That is the reason our current score is _92_. Once you host this app on deployment server such as **Firebase** which are secured by default and use HTTPS, you will be able to configure HTTPS and then all of the audits will pass.

You can find the complete code for this application demo at the Github repository below.
