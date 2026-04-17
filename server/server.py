from websockets import ConnectionClosed, ServerConnection, serve
import asyncio
import json
import logging


from game import Game


games: dict[str, Game] = {}
connections: dict[ServerConnection, str] = {}

logging.basicConfig(
    format="[%(asctime)s] %(levelname)s: %(message)s",
    level=logging.INFO
)




async def handle(client: ServerConnection):
    logging.info(f"\"{client.remote_address[0]}\" connected")
    try:
        while True:
            message = json.loads(await client.recv(True))
            logging.info(f"from \"{client.remote_address[0]}\": {message}")

            if message["req"] == "gamejoin":
                connections[client] = message["username"]
                game = message["game"]
                if not games.get(game):
                    games[game] = Game()
                games[game].add_player(message["username"])
    except ConnectionClosed as e:
            name = connections.get(client)
            if name:
                logging.info(f"{name} disconnected: {e}")
                for game in games:
                    if games[game].remove_player(name):
                        break
                connections.pop(client)
            else:
                logging.info(f"\"{client.remote_address[0]}\" disconnected: \"{e}\"")


        


async def main():
    async with serve(handle, "localhost", 7765, logger=logging.getLogger("websockets.server")) as server:
        await server.serve_forever()


if __name__ == "__main__":
    asyncio.run(main())
