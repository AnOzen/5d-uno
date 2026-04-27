from websockets import ConnectionClosed, ServerConnection, serve
import asyncio
import json
import logging


from game import Game


games: dict[str, Game] = {}
connections: dict[str, ServerConnection] = {}

games["test"] = Game()

logging.basicConfig(
    format="[%(asctime)s] %(levelname)s: %(message)s", level=logging.INFO
)


async def handle(client: ServerConnection):
    logging.info(f'"{client.remote_address[0]}" connected')
    try:
        while True:
            message = json.loads(await client.recv(True))
            logging.info(f'from "{client.remote_address[0]}": {message}')

            if message["req"] == "gamejoin":
                connections[message["username"]] = client
                game = message["game"]
                if not games.get(game):
                    games[game] = Game()
                games[game].add_player(message["username"])
                logging.info(
                    f"\"{message['username']}\" joined game \"{game}\": {games[game]}"
                )
                await games[game].broadcast_players(connections)
            if message["req"] == "playerready":
                game = message["game"]
                games[game].set_ready(message["username"], message["ready"])
                await games[game].broadcast_players(connections)
                if not False in games[game].ready and len(games[game].ready) == 4:
                    games[game].init_state()
                    await games[game].broadcast_start(connections)
                    await games[game].broadcast_stateadd(connections, 0)

    except ConnectionClosed as e:
        user = None
        for na in connections:
            if client == connections[na]:
                user = na
                break
        if not user:
            logging.info(f'"{client.remote_address[0]}" disconnected: "{e}"')
        else:
            for game in games:
                if games[game].remove_player(user):
                    await games[game].broadcast_players(connections)
            for game in games.copy():
                if len(games[game].players) == 0:
                    games.pop(game)
            logging.info(f'"{user}" disconnected: "{e}"')
    logging.info(f"current games: {list(games.keys())}")


async def main():
    async with serve(
        handle, "localhost", 7765, logger=logging.getLogger("websockets.server")
    ) as server:
        await server.serve_forever()


if __name__ == "__main__":
    asyncio.run(main())
