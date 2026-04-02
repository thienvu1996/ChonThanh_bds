SYSTEM DIRECTIVE: Continue "BĐS Chơn Thành" project.

EXECUTE CONFIGURATION: SET PORT TO 80 FOR DEMO
We need to run the development server on port 80 so it can be easily accessed via Remote Desktop or Local Network without appending port numbers.

1. Update 'vite.config.js' (or create it if it doesn't exist). Configure the server object to use port 80 and expose it to the network.
Example:
export default defineConfig({
  plugins: [react()],
  server: {
    port: 80,
    host: true, // or '0.0.0.0' to expose to network
    strictPort: true
  }
})

2. Update 'package.json'. Ensure the dev script exposes the host:
"scripts": {
  "dev": "vite --host",
  // ...
}

Output the updated 'vite.config.js' and 'package.json' files.