# RPC Package Design

## Context

The RPC package provides terminal-to-terminal communication capabilities using Unix domain sockets and the bare-rpc protocol. This enables inter-process communication between different terminal sessions running BareChat applications.

## Goals / Non-Goals

### Goals
- Enable reliable IPC (Inter-Process Communication) between terminal instances
- Provide simple client-server architecture for message passing
- Support both direct messaging and broadcast communication
- Maintain compatibility with Bare runtime environment
- Offer comprehensive testing infrastructure

### Non-Goals
- Persistent message storage (handled by other packages)
- Network-based communication (focus on local IPC only)
- Authentication or authorization (anonymous by design)
- Complex routing or message queuing

## Decisions

### Decision: Unix Domain Sockets
- **What**: Use Unix domain sockets for local IPC
- **Why**: Efficient, secure, and widely supported on Unix-like systems
- **Alternatives considered**: Named pipes (FIFOs), TCP localhost, shared memory
- **Rationale**: Sockets provide bidirectional communication and are well-suited for RPC patterns

### Decision: bare-rpc Protocol
- **What**: Use bare-rpc library for RPC implementation
- **Why**: Native Bare runtime compatibility, lightweight, protocol-agnostic
- **Alternatives considered**: Custom protocol, JSON-RPC, gRPC
- **Rationale**: bare-rpc provides the right balance of simplicity and functionality for Bare environment

### Decision: Command-based Message Types
- **What**: Use numeric command IDs (1=sendMessage, 2=broadcast)
- **Why**: Simple, efficient, and extensible
- **Alternatives considered**: String-based commands, JSON message types
- **Rationale**: Numeric commands are faster to parse and easier to extend

### Decision: Socket Path Management
- **What**: Use OS temporary directory with fixed socket name
- **Why**: Predictable location, automatic cleanup by OS
- **Alternatives considered**: User home directory, configurable paths, random names
- **Rationale**: Simplicity and reliability for terminal-based usage

## Architecture

### Components

#### RPCServer
- Creates and manages Unix domain socket
- Handles incoming client connections
- Processes RPC commands and returns responses
- Manages connection lifecycle

#### RPCClient  
- Connects to RPC server socket
- Sends RPC commands and receives responses
- Handles connection errors and cleanup
- Provides high-level API for messaging

#### CLI Interface
- Wraps server/client functionality in executable commands
- Provides user-friendly command-line interface
- Handles argument parsing and error reporting

### Communication Flow

1. **Server Startup**: Create socket, start listening
2. **Client Connection**: Connect to socket, establish RPC session
3. **Message Exchange**: Client sends command, server processes and responds
4. **Cleanup**: Client disconnects, server cleans up resources

## Error Handling Strategy

### Connection Errors
- Socket not found: Clear error message suggesting server start
- Permission denied: Check socket permissions and directory access
- Connection refused: Server not running or overloaded

### Protocol Errors
- Invalid command: Return error response with details
- Malformed data: Log error and close connection gracefully
- Timeout: Implement reasonable timeouts for operations

### Resource Management
- Socket cleanup on server shutdown
- Connection limits to prevent resource exhaustion
- Proper error propagation to client applications

## Security Considerations

### Local Access Only
- Unix domain sockets restrict access to local system
- File system permissions control socket access
- No network exposure reduces attack surface

### Data Privacy
- Messages stay within local system
- No persistent logging of sensitive data
- Socket permissions prevent unauthorized access

## Performance Characteristics

### Latency
- Sub-millisecond local IPC latency
- Minimal protocol overhead
- Direct socket communication

### Throughput
- Limited by socket buffer sizes
- Suitable for chat message volumes
- No network bandwidth constraints

### Resource Usage
- Single socket file per server instance
- Minimal memory footprint
- Efficient connection handling

## Testing Strategy

### Unit Testing
- Individual component testing (server, client)
- Protocol validation
- Error condition simulation

### Integration Testing
- End-to-end message exchange
- Multiple client scenarios
- Concurrent connection handling

### Automated Testing
- Script-based test execution
- Background server management
- Result validation and reporting

## Migration Plan

### Version Compatibility
- Semantic versioning for API changes
- Backward compatibility for minor versions
- Clear deprecation path for breaking changes

### Socket Path Changes
- Version-specific socket paths if needed
- Graceful fallback mechanisms
- Migration documentation

## Open Questions

- Should we implement connection pooling for multiple clients?
- Do we need message prioritization or queuing?
- Should we add compression for large messages?
- Is there a need for message persistence at the RPC level?