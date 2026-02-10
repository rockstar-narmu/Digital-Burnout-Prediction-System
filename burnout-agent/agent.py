from pynput import keyboard, mouse
import psutil
import pygetwindow as gw
import requests
import time
from datetime import datetime

keystrokes = 0
mouse_moves = 0
scroll_count = 0  # NEW

# Keyboard listener
def on_press(key):
    global keystrokes
    keystrokes += 1

# Mouse movement listener
def on_move(x, y):
    global mouse_moves
    mouse_moves += 1

# Mouse scroll listener
def on_scroll(x, y, dx, dy):
    global scroll_count
    scroll_count += 1

keyboard_listener = keyboard.Listener(on_press=on_press)
mouse_listener = mouse.Listener(on_move=on_move, on_scroll=on_scroll)

keyboard_listener.start()
mouse_listener.start()

def get_active_app():
    try:
        window = gw.getActiveWindow()
        if window:
            pname = window.title
            return pname
    except:
        return "Unknown"
    return "Unknown"

while True:
    app_name = get_active_app()

    activity = {
        "source": "desktop",
        "appName": app_name,
        "keystrokes": keystrokes,
        "mouseMoves": mouse_moves,
        "scrolls": scroll_count,  # NEW
        "timestamp": datetime.now().isoformat()
    }

    try:
        requests.post("http://localhost:5000/log", json=activity)
        print("Sent:", activity)
    except:
        print("Backend unreachable.")

    keystrokes = 0
    mouse_moves = 0
    scroll_count = 0  # reset

    time.sleep(10)  # send every 10 seconds
