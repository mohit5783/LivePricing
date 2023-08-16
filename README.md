
# Live Pricing Application

This is a live pricing application that displays real-time pricing data for various forex symbols. It utilizes the Deriv API to fetch tick data and historical prices. The application is built using React and Ant Design.

## Functionality

The current version of the application provides the following functionality:

-   Fetches a list of active forex symbols from the Deriv API.
-   Retrieves and displays the latest tick prices for each symbol.
-   Displays the 24-hour change in price for each symbol.
-   Supports sorting of columns in the table.

## Prerequisites

To build and execute the live pricing application on any Linux-based device, ensure that you have the following dependencies installed:

- Node.js: The application requires Node.js to be installed. You can download and install Node.js by following the instructions for your Linux distribution. It is recommended to use the LTS version.

## Getting Started

To run the live pricing application on your Linux-based device, follow these steps:

1. Download the zip file containing the application.
2. Extract the contents of the zip file to a directory of your choice.

## Installation

Open a terminal and navigate to the extracted directory.

```bash
cd live-pricing-app

```
Run the following command to install the dependencies:

```bash
npm install
```

## Configuration

Before running the application, you need to configure the WebSocket connection. Open the `App.js` file located in the `src` directory.

```javascript
const app_id = 1089;
const connection = new WebSocket(
  `wss://ws.binaryws.com/websockets/v3?l=EN&app_id=${app_id}`
);
```

Replace the `app_id` value with your own app ID. You can obtain an app ID by signing up on the Deriv Developer Portal.

## Building the Application

To build the live pricing application, use the following command:

```bash
`npm run build` 
```

This command will create a production-ready build of the application in the `build` directory.

## Running the Application

Copy the contents of the `build` directory to your Linux-based device where you want to run the application.

To serve the built application using a static file server, you can use tools like `serve` or `nginx`. Here's an example using `serve`:

1.  Install `serve` globally by running the following command:
```bash
npm install -g serve
```
2. Navigate to the `build` directory:
```bash
cd path/to/build
```
3. Start the static file server:
```bash
serve -p 3000
```

The application will be available at `http://localhost:3000`.


## Further Development

If you had more time to improve the application, here are some possible enhancements:


- **Error handling**: Enhance error handling to gracefully handle API failures and display appropriate error messages to the user.

- **Authentication**: Add user authentication and authorization to secure the application and provide personalized experiences.

- **Symbol search**: Implement a search functionality to allow users to search for specific symbols, making it easier to find and track specific forex pairs.

- **Data caching**: Implement a caching mechanism to store previously fetched symbol data, reducing the number of API calls and improving performance.

- **Responsive design**: Optimize the application layout and styling to ensure a seamless experience across different screen sizes and devices.

- **Error logging**: Set up a logging system to capture and track application errors, making it easier to diagnose and troubleshoot issues.

## Troubleshooting

If you encounter any issues or errors while building or running the application, try the following steps:

-   Ensure that you have a stable internet connection.
-   Verify that the WebSocket connection URL is correct in the `App.js` file.
-   Double-check that all the dependencies are properly installed by running `npm install` again.
-   If the issue persists, refer to the project's issue tracker or seek help from the community.

### Note

> Please note that the instructions assume basic familiarity with using a terminal and running commands on a Linux-based system. Additionally, make sure that the zip file contains all the necessary files for the application to build and run successfully on any Linux-based device.