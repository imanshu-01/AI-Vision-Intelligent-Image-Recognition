import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.datasets import cifar10
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.callbacks import EarlyStopping

# ------------------ Load Dataset ------------------
(x_train, y_train), (x_test, y_test) = cifar10.load_data()

# Normalize
x_train = x_train.astype("float32") / 255.0
x_test  = x_test.astype("float32") / 255.0

# One-hot encoding
y_train = to_categorical(y_train, 10)
y_test  = to_categorical(y_test, 10)

# ------------------ MobileNetV2 Base ------------------
base_model = tf.keras.applications.MobileNetV2(
    input_shape=(96, 96, 3),
    include_top=False,
    weights="imagenet"
)

base_model.trainable = False   # FAST TRAINING

# ------------------ Build Model ------------------
model = models.Sequential([
    layers.Resizing(96, 96),          # IMPORTANT
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.BatchNormalization(),
    layers.Dense(256, activation="relu"),
    layers.Dropout(0.4),
    layers.Dense(10, activation="softmax")
])

# ------------------ Compile ------------------
model.compile(
    optimizer="adam",
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

model.summary()

# ------------------ Early Stop ------------------
early_stop = EarlyStopping(
    monitor="val_accuracy",
    patience=2,
    restore_best_weights=True
)

# ------------------ Train (FAST) ------------------
model.fit(
    x_train, y_train,
    epochs=8,              # 👈 VERY FEW
    batch_size=128,
    validation_data=(x_test, y_test),
    callbacks=[early_stop]
)

# ------------------ Save ------------------
model.save("cifar10_model.h5")
print("✅ cifar10_model.h5 saved")
