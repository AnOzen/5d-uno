class Game:
    def __init__(self) -> None:
        self.players: list[str] = []

    def add_player(self, username: str) -> bool:
        try:
            self.players.index(username)
            return False
        except:
            self.players.append(username)
            return True

    def remove_player(self, username: str) -> bool:
        try:
            self.players.remove(username)
            return True
        except:
            return False
