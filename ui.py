import customtkinter as ctk
from tkinter import messagebox
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg

ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

app = ctk.CTk()
app.title("Insurance Charges Prediction")
app.geometry("1200x700")

left_frame = ctk.CTkFrame(app, width=350)
left_frame.pack(side="left", fill="y", padx=15, pady=15)

right_frame = ctk.CTkFrame(app)
right_frame.pack(side="right", fill="both", expand=True, padx=15, pady=15)

title = ctk.CTkLabel(
    left_frame,
    text="Insurance Charges\nPrediction",
    font=("Arial",26,"bold")
)
title.pack(pady=20)

ctk.CTkLabel(
    left_frame,
    text="Age",
    font=("Arial",16)
).pack(pady=(15,5))

age_entry = ctk.CTkEntry(
    left_frame,
    width=220,
    height=35,
    placeholder_text="Enter Age"
)
age_entry.pack()

ctk.CTkLabel(
    left_frame,
    text="BMI",
    font=("Arial",16)
).pack(pady=(20,5))

bmi_entry = ctk.CTkEntry(
    left_frame,
    width=220,
    height=35,
    placeholder_text="Enter BMI"
)
bmi_entry.pack()

result_label = ctk.CTkLabel(
    left_frame,
    text="Predicted Charges\n₹0",
    font=("Arial",22,"bold"),
    text_color="lightgreen"
)
result_label.pack(pady=25)

fig = plt.figure(figsize=(8,6))
ax = fig.add_subplot(111, projection='3d')

canvas = FigureCanvasTkAgg(fig, master=right_frame)
canvas_widget = canvas.get_tk_widget()
canvas_widget.pack(fill="both", expand=True)

def draw_graph(pred_age=None, pred_bmi=None, pred_charge=None):

    ax.clear()

    ax.scatter(
        x1,
        x2,
        y,
        color="red",
        s=25,
        label="Actual Data"
    )

    x1_range = np.linspace(x1.min(), x1.max(), 10)
    x2_range = np.linspace(x2.min(), x2.max(), 10)

    X1_grid, X2_grid = np.meshgrid(x1_range, x2_range)

    Y_pred = model.predict(
        np.column_stack(
            (X1_grid.ravel(), X2_grid.ravel())
        )
    )

    Y_pred = Y_pred.reshape(X1_grid.shape)

    ax.plot_surface(
        X1_grid,
        X2_grid,
        Y_pred,
        alpha=0.4,
        cmap="viridis"
    )

    if pred_age is not None:

        ax.scatter(
            pred_age,
            pred_bmi,
            pred_charge,
            color="blue",
            s=180,
            label="Prediction"
        )

    ax.set_xlabel("Age")
    ax.set_ylabel("BMI")
    ax.set_zlabel("Charges")
    ax.set_title("Insurance Charges Prediction")

    ax.legend()

    canvas.draw()

def predict():

    try:

        age = float(age_entry.get())
        bmi = float(bmi_entry.get())

        charge = model.predict([[age,bmi]])[0]

        result_label.configure(
            text=f"Predicted Charges\n₹ {charge:,.2f}"
        )

        draw_graph(age,bmi,charge)

    except:

        messagebox.showerror(
            "Error",
            "Please enter valid Age and BMI."
        )

predict_btn = ctk.CTkButton(
    left_frame,
    text="Predict Charges",
    width=220,
    height=45,
    font=("Arial",16,"bold"),
    command=predict
)

predict_btn.pack(pady=20)

draw_graph()

app.mainloop()