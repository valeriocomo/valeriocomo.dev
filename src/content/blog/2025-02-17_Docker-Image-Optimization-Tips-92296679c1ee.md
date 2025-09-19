---
title: Docker Image Optimization Tips
pubDate: 2025/02/17 9:20
author: "Valerio Como"
tags:
  - Docker
  - DockerImage
imgUrl: '../../assets/blog/2025-02-17-docker-image-optimizaiton-tips/cover.png'
description: How to reduce the size of the docker image up to 10x
---


### Docker Image Optimization Tips

#### How to reduce the size of the docker image up to 10x

![](https://cdn-images-1.medium.com/max/2560/1*9Krc-TCmjVWBu5Znn14mCQ.png)

This is a post of a series about Docker Image Optimizations. This series is composed by the following post:

* Docker Image Optimization Tips (**this post!**)
* Docker Image Optimization: Multi-stage build
* Docker Image Optimization: Tools
* Docker Image Optimization: Distroless images

---

### Introduction

Docker has revolutionized modern software development by making it simple to create, distribute, and run applications in isolated environments. However, oversized Docker images can slow down deployments, raise security concerns and waste unnecessary resources (and money too!).

This post will lead you through key approaches for lowering Docker image sizes, increasing efficiency, and ensuring that your deployments are lean and efficient.

To keep things simple, we’ll use the same example throughout: a simple web server built with *node.js*.

We will start with the following Dockerfile:

```
FROM node:latest  
WORKDIR /app  
COPY . .  
RUN npm install  
CMD ["node", "server.js"]
```

### Image selection

The choice of base image has a huge impact on the final image size. Sometimes, for the sake of simplicity, it would be easier to start with *node:latest*, which includes extra tools and libraries that aren’t needed in production.

Instead, we can use a *Alpine Linux* flavor, a lightweight distribution tailored for containers.

```
FROM node:20-alpine  
WORKDIR /app  
COPY . .  
RUN npm install --only=production  
CMD ["node", "server.js"]
```

This small change will lead you to a smaller image.

Alpine images are built on purpose for containerization. Everything is stripped out except the runtime.

However, nothing is perfect. You could end up in compatibility issue if you work with native module because it ships a reduced version of linux system library.

Most popular images have an alpine version. As rule of thumb, you could adopt a full version of an image for a development environment and an alpine version for a production contest.

Google has taken the concept to the edge, creating *Distroless* images. These images contains only your application and its runtime. This topic will be covered in a post of this series.

### Removing unused files

A simple addition lightweights your Docker image. Starting from the previous Dockerfile, we’ll add just one line

```
FROM node:20-alpine  
WORKDIR /app  
COPY . .  
RUN npm install --only=production  
RUN npm cache clean --force  
CMD ["node", "server.js"]
```

This keeps only production dependencies.

### Layer caching

Before diving into the solution, it’s worthy to understand how caching works.

Each instruction in a Dockerfile has its own layer and Docker can cache it. Each layer in a Docker image contains only the delta from previous level.

There are three main reasons for cache invalidation:

* Changes to the files you’re copying
* Changes to Dockerfile instruction
* Changes to any previous layers

In the following Dockerfile, it’s will copy just *package\*.json* files. This is because dependencies change less frequent than our code. Then Docker will create a layer. So if dependencies don’t change, its layer will be cached.

```
FROM node:20-alpine  
WORKDIR /app  
COPY package*.json .  
RUN npm install --only=production   
RUN npm cache clean --force  
COPY . .  
CMD ["node", "server.js"]
```

This reuses the same cache version until one of the dependencies is changed in *package.json*.

### Reduce Layers

As stated in previous paragraph, each `RUN` statement in Dockerfile creates a new **layer**. Too many layers lead to **larger images** and slower builds. We can combine commands into a single layer to **minimize image size**:

```
FROM node:20-alpine  
WORKDIR /app  
COPY package*.json .  
RUN npm install --only=production && npm cache clean --force  
COPY . .  
CMD ["node", "server.js"]
```

### Multi-stage builds

A common issue with Docker images is the presence of unnecessary build tools in the shipped image. Multi-stage builds enable us to keep build dependencies separate from the final runtime image.

```
# Build Stage  
FROM node:20 AS builder  
WORKDIR /app  
COPY package*.json .  
RUN npm install --only=production && npm cache clean --force  
COPY . .  
  
# Final Lightweight Stage  
FROM node:20-alpine  
WORKDIR /app  
COPY --from=builder /app .  
CMD ["node", "server.js"]
```

What’s the output? The final image only contains the **bare minimum** needed to run the app. No build tools, no unnecessary piece of software.

This topic will be covered in depth in one of the next posts in this series.

### Using a .dockerignore file

A `.dockerignore` acts as a *.gitignore* file. It prevents unnecessary files from being copied into the image. Add files like:

```
node_modules  
.git  
.env  
logs
```

This ensures a cleaner, faster build process. Straightforward.

### Consistency tip

Whenever writing a Dockerfile, avoid the`latest` tag in Production**.** You must remember to specify an exact version of your runtime instead of relying on `latest`:

```
FROM node:20.5.1-alpine
```

This is not really an optimization itself, but it ensures consistency between environments.

### Conclusion

By following these optimizations, our application now has a significantly smaller, faster and more secure Docker image. In **Part 2**, we’ll explore **multi-stage builds** in detail to further refine our optimization techniques.