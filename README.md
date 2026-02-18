<div align="center">

# NOVA Framework - Core

**A modern, optimized framework for FiveM RP servers.**

Built with performance, security, modularity, and ease of use in mind.

[![License](https://img.shields.io/badge/license-GPL--3.0-green)](LICENSE)
[![FiveM](https://img.shields.io/badge/FiveM-compatible-blue)](https://fivem.net)
[![Docs](https://img.shields.io/badge/docs-GitBook-orange)](https://novaframeworkdoc.gitbook.io/novaframework/)

</div>

---

## Quick Start

**Requirements:** FiveM Server, [oxmysql](https://github.com/overextended/oxmysql), MySQL/MariaDB

1. Place `nova_core` inside `resources/[nova]/`
2. Import the SQL schema: `nova_core/sql/nova.sql`
3. Add to `server.cfg`:
```cfg
ensure oxmysql
ensure nova_core
```
4. Configure `config/main.lua` to your liking

## Usage

```lua
-- Server
local Nova = exports['nova_core']:GetObject()
local player = exports['nova_core']:GetPlayer(source)

-- Client
local Nova = exports['nova_core']:GetObject()
local playerData = exports['nova_core']:GetPlayerData()
```

## Features

- **Multi-character** system with character creation
- **Economy** — cash, bank, black money with full management
- **Jobs & Gangs** — database-driven with grades, duty system, salary
- **Permissions** — O(1) cached system with ACE bridge
- **Vehicle Keys** — lock/unlock, ownership tracking
- **Weather/Time Sync** — server-authoritative, smooth transitions
- **Needs System** — hunger/thirst with HUD integration
- **World Control** — NPC/traffic management
- **Callbacks** — async server-client communication
- **Localization** — Portuguese & English built-in

## Documentation

Full documentation with exports, events, callbacks, player object reference, and development guides:

### **[Read the Docs](https://novaframeworkdoc.gitbook.io/novaframework/)**

## License

This project is licensed under the GPL-3.0 License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**NOVA Framework** — Made with care for the FiveM community.

[Documentation](https://novaframeworkdoc.gitbook.io/novaframework/) · [Discord](https://discord.gg/novaframeworkofc) · [GitHub](https://github.com/NoVaPTdev)

</div>
