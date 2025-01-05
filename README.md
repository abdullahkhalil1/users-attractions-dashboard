# UsersAndAttractionsDashboard

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.6.

## Development server

To start a local development server, run:

```bash
git clone https://github.com/abdullahkhalil1/users-attractions-dashboard.git
```
```bash
cd users-and-attractions-dashboard
```

```bash
npm install
```

```bash
npm start
```

Once the server is running, open the browser and navigate to `http://localhost:4200/`.

You can this account to login
email: karn.yong@melivecode.com
password: "melivecode",



## Building

To build the project run:

```bash
ng build
```

This will compile the project and store the build artifacts in the `dist/` directory.

## Running unit tests

To execute unit tests with the [Karma] test runner, use the following command:

```bash
ng test
```
I added unit test for the critical components (users, attractions, pet sales) and the facades and services for each module

## UI & Styling

I used tailiwnd and Angular material


## Project Structure

### Core

The `core` folder contains singleton services, guards, interceptors, and models that are used throughout the application.

- **guards/**: Contains route guards for protecting routes.
- **interceptors/**: Contains HTTP interceptors for handling HTTP requests and responses.
- **models/**: Contains TypeScript interfaces and models used throughout the application.
- **services/**: Contains singleton services that are used across the application.


### Features

The `features` folder contains the main features of the application, each feature in its own subdirectory.

- **login/**: Contains components, services, and other code related to the login functionality.
- **users/**: Contains components, services, and other code related to user management.
- **attractions/**: Contains components, services, and other code related to attractions management.
- **pet-sales/**: Contains components, services, and other code related to pet sales management.



### Layout

The `layout` folder contains components related to the layout of the application, such as the main navigation and layout components.


### Shared

The `shared` folder contains reusable components, directives, and services that can be used across different modules.

- **components/**: Contains reusable components.
- **directives/**: Contains reusable directives.
- **material/**: 
The `MaterialModule` serves as a central place to import and export Angular Material components. By doing this, you can avoid importing Angular Material components individually in each module, reducing redundancy and improving maintainability.


## State Management with Facade Pattern

### Facade Pattern

In this project, I use the facade pattern with behaviorSubject for state management. The facade pattern provides a simplified interface to a complex subsystem, making it easier to interact with the state management logic.

### Benefits of Using Facade Pattern

- **Simplified Interface**: The facade pattern provides a simple and consistent API for interacting with the state, hiding the complexities of the underlying state management logic.
- **Encapsulation**: It encapsulates the state management logic, making it easier to maintain and refactor.
- **Separation of Concerns**: By using facades, we separate the state management logic from the components, promoting a cleaner and more modular architecture.

- **Note** Core Data Module for Larger Projects
In larger projects, it is more efficient to organize all facades and services in a core data module. This approach centralizes the state management logic and services, making it easier to manage dependencies and promote reusability.




