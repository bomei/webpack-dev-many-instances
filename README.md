# Webpack Dev with Multiple Config

Use `webpack`, `webpack-dev-middleware`, `webpack-hot-middleware` to implement a dev server for webpack application. The three package above works fine when working with a single config, but `webpack-hot-middleware` just not working so well when I want to serve two or more applications with just **one** port in my host. 

So I just cloned the [webpack-contrib/webpack-hot-middleware](https://github.com/webpack-contrib/webpack-hot-middleware) down to my project and modified it somehow.

## What's multiple configs?

Generally, I can serve different single-config apps in different ports, and then use `nginx` to proxy them all. Ports, however, is limited in one pc and is hard to manage. Changing the urls and letting them point to different apps are better apparently.

It looks like:

* When I type in `http://localhost:5000/key1`, I go to the `key1` application, it use specific `websocket` path(eg. `/ws/key1/__websocket_hmr`) also to     make its websocket connection where it transfer the HMR infomation.

* And when I change the url to `http://localhost:5000/key2`, I go to `key2` application and use `/ws/key2/__websocket_hmr` to make websocket connection.

## How to run the demo?

```bash
git clone https://github.com/bomei/webpack-dev-many-instances
cd webpack-dev-many-instances
npm i
npm run dev
```

The server works on port `5000`.

Modify the `./src/key1/printMe.js` and see the change in `http://localhost:5000/key1`， or modify the `./src/key2/printMe.js` and see the change in `http://localhost:5000/key2`.

Or if you want to dev this `web-hot-middleware`, you should use `npm run dev-dev` instead of `npm run dev`, then follow the instruction [Debugging Node.js with Google Chrome](https://medium.com/the-node-js-collection/debugging-node-js-with-google-chrome-4965b5f910f4).


Just change `./src/{name}/printMe.js` to see the change.

## Generate new App from templates

```bash
npm run new -- --name {name}
```

The code above will generate a new config file named `webpack.config.{name}.js` in the `./configs/` folder. I use the [`xtpl`](https://github.com/xtemplate/xtpl) package to render the template file, check [`utils/newApp.js`](./utils/newApp.js) for detail.

You can modify the conf under `./configs/`, and server will load all the config there.


## Delete app

```bash
npm run delete -- --name {name}
```

This code will remove `./configs/webpack.config.{name}.js` and the `./src/{name}` folder.


## What's been modified?

I did modify some codes, you'd better use some tools to compare those code files.

Shortly, under the case using multiple configs:

|Previous Code|Current Code|
|:---|:---|
|Send every bundle to every application.|Send the bundle to the application which has the same `name`( suck as `key1`, `key2` above).|
|Use number to identify the application websocket clients|Use app name to identify the application websocket clients|
|Use `/__webpack_hmr` to server websocket.|Use `/ws/{name}/__webpack_hmr` to serve websocket.|


## What need improve?

* While just modifying files of one application, all other configs(or call bundles) will be rebuilt, I think this can be an issue with `webpack`. I have no idea about how this behaviour will impact the performance, but we don't want this anyway.



