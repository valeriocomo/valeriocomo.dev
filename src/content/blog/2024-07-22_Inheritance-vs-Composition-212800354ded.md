---
title: Inheritance vs Composition
pubDate: 2024/07/22 9:20
author: "Valerio Como"
tags:
  - OOP
  - CodeDesign
imgUrl: '../../assets/blog/2024-07-22-inheritance-vs-composition/cover.jpg'
description: PROs and CONs of Inheritance and Composition in Object-Oriented Programming
---

### Inheritance vs Composition

#### PROs and CONs of Inheritance and Composition in Object-Oriented Programming

![](https://cdn-images-1.medium.com/max/800/0*BMpF7nqGTca6yFRq.jpg)

Red pill or blue pill?

Throughout my whole career, I debated a lot with my colleagues about what was the best way to share behaviors between classes. Many of them go for the inheritance, others prefer composition. Beyond personal taste, I think it would be better write down few words to clarify these concepts.

*Inheritance* and *composition* are two fundamental design principles in object-oriented programming (*OOP*). Although they accomplish this in different ways, both are used to create relationships between classes and reuse code. Here’s a comparison between them.

### Inheritance

**Definition**: *Inheritance* is a mechanism by which a new class (called a *subclass* or *derived class*) inherits attributes and methods from an existing class (called a *superclass* or *base class*).

#### Key Points

**“Is-a” Relationship**: *Inheritance* represents an “*is-a*” relationship. For example, a `Dog` class can inherit from an `Animal` class because a dog is a type of animal.

**Code Reusability:** *Inheritance* allows for the reuse of code by extending existing classes. The *subclass* can override or extend the functionalities of the *superclass*.

**Single and Multiple Inheritance:** Some programming languages support *single inheritance* (a class can inherit from only one *superclass*), while others support *multiple inheritance* (a class can inherit from more than one *superclass*). *Multiple inheritance* can introduce complexity and ambiguity, often referred to as the [*diamond problem*](https://en.wikipedia.org/wiki/Multiple_inheritance#The_diamond_problem).

**Polymorphism:** *Inheritance* supports *polymorphism*, where a *subclass* can be treated as an instance of its *superclass*. This allows for flexible and interchangeable code.

#### Example

```
class Animal {  
    speak(): string {  
        return "Some sound";  
    }  
}  
  
class Dog extends Animal {  
    speak(): string {  
        return "Bark";  
    }  
}  
  
const myDog = new Dog();  
console.log(myDog.speak());  // Output: Bark
```

The `Dog` class inherits from the `Animal` class, demonstrating how a subclass can override the methods of a *superclass*.

### Composition

**Definition**: *Composition* is a design principle where a class is composed of one or more objects from other classes, implying a “*has-a*” relationship.

**Key Points**

**“Has-a” Relationship**: *Composition* represents a “*has-a*” relationship between two concepts. For example, a `Car` class can have an `Engine` class because a car has an engine.

**Flexibility**: *Composition* is often preferred for flexibility and maintainability. By assembling multiple objects, it enables behavior changes without changing the existing code.

**Encapsulation**: *Composition* promotes better encapsulation since it keeps each component self-contained.

**Reuse by Delegation**: Instead of inheriting behavior, a class delegates responsibilities to its components.

#### Example

```
class Engine {  
    start(): string {  
        return "Engine starting";  
    }  
}  
  
class Car {  
    private engine: Engine;  
  
    constructor(engine: Engine) {  
        this.engine = engine;  
    }  
  
    start(): string {  
        return this.engine.start();  
    }  
}  
  
const engine = new Engine();  
const car = new Car(engine);  
console.log(car.start());  // Output: Engine starting
```

The `Car` class is composed of an `Engine` class, demonstrating how one class can delegate responsibilities to its component classes.

### When to Use Inheritance vs Composition

As developer, you should use *Inheritance* when:

* There is a clear hierarchical relationship (is-a relationship).
* You want to reuse code from the base class.
* *Polymorphism* is needed to treat *subclass* instances as instances of the *superclass*.

You should use*Composition*when:

* You need greater flexibility and encapsulation.
* The relationship between classes is more of a “*has-a*” than an “*is-a*”.
* You want to avoid the complexity and limitations of inheritance, especially in languages that don’t support multiple inheritance.
* You need to change behavior at runtime by composing different objects.

### Wrap up

In brief, it’s possible to wrap up in this way.

**Inheritance**: Suitable for a clear “*is-a*” relationship, promotes code reuse through class hierarchies, supports *polymorphism* but can lead to tight coupling and issues with *multiple inheritance*.

**Composition**: Suitable for a “*has-a*” relationship, promotes flexibility, maintainability, and better encapsulation, avoids issues with *multiple inheritance*, and allows dynamic changes in behavior.

Choosing between *inheritance* and *composition* depends on the specific requirements and design goals of your application.

I hope this post is useful for you. Leave a comment and let me know what you think.