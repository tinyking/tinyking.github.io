---
title: 使用Angular cli管理多种环境配置
date: 2018-10-16 18:24:30
tags:
    - angular
---

Most web applications require to run in different environments before they make their way to production. You might need a build for your QA team to perform some tests, or a specific build to run on your continuous integration server for instance.

All of these builds will likely require a different config: Different server URLs, different logging options, etc.

Angular CLI offers an environment feature that allows to run builds targeted at specific environments. For instance, here is how you would run a build for production:
```
ng build --env=prod   // For Angular 2 to 5
```
Update: With Angular 6+, the command is now:
```
ng build --configuration=production
```
The prod flag in the above code refers to the prod (production in v6+) property of the environments section of .angular-cli.json before v6:(now angular.json in v6+), which has two options by default: dev and prod
```json
"environments": {
  "dev": "environments/environment.ts",
  "prod": "environments/environment.prod.ts"
}
```
You can add as many environments you need here. For instance, if you need a QA build option, just add the following entry in .angular-cli.json:
```json
"environments": {
  "dev": "environments/environment.ts",
  "prod": "environments/environment.prod.ts",
  "qa": "environments/environment.qa.ts"
}
```
For v6+, angular.json environments are now called configurations. Here is how to add a new qa environment after v6:
```json
"configurations": {
  "production": { ... },
  "qa": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.qa.ts"
      }
    ]
  }
}
```
Then you have to create the actual file environment.qa.ts in the environments directory.

Here is what the default environment.ts file for dev looks like:
```
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: false
};
```
The above environment object is where you would add any environment specific property. For instance, let’s add a server URL:
```
export const environment = {
  production: false,
  serverUrl: "http://dev.server.mycompany.com"
};
```
Then all you have to do to provide a different URL for QA is to define that same property with the right value in environment.qa.ts:
```
export const environment = {
  production: false,
  serverUrl: "http://qa.server.mycompany.com"
};
```
Now that your environments are defined, how do you use those properties in your code? Easy enough, all you have to do is import the environment object as follows:
```
import {environment} from '../../environments/environment';


@Injectable()
export class AuthService {

  LOGIN_URL: string = environment.serverUrl + '/login' ;
```
Then when you run a build for QA, Angular CLI is going to use environment.qa.ts to read the environment.serverUrl property value and you’re all set to deploy that build to the QA environment.
