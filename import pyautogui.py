import pyautogui
import time

pyautogui.FAILSAFE = True
pyautogui.PAUSE = 0.1
interval = 1

print("Starting AutoAccept... Move mouse to top-left corner to stop.")
try:
    while True:
        pyautogui.hotkey('command', 'enter')  # Simulates Cmd+Enter on macOS
        print("Simulated Cmd+Enter")
        time.sleep(interval)
except KeyboardInterrupt:
    print("Script stopped by user.")