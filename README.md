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
