import tkinter as tk
from tkinter import messagebox

def show_message():
    user_input = entry.get()
    if user_input.strip():
        messagebox.showinfo("Your Input", f"You entered: {user_input}")
    else:
        messagebox.showwarning("Empty Input", "Please enter something!")

# Create the main window
root = tk.Tk()
root.title("Tkinter Sample App")
root.geometry("300x200")  # Width x Height

# Create a label
label = tk.Label(root, text="Enter something:", font=("Arial", 12))
label.pack(pady=10)

# Create an entry widget
entry = tk.Entry(root, width=30)
entry.pack(pady=5)

# Create a button
button = tk.Button(root, text="Show Message", command=show_message)
button.pack(pady=10)

# Start the main event loop
root.mainloop()
