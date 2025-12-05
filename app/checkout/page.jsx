"use client";

import React, { useEffect, useState } from "react";
import {
  Text,
  Button,
  Group,
  Card,
  Image,
  Badge,
  Divider,
  Stack,
  Box,
  NumberInput,
  TextInput,
  Select,
} from "@mantine/core";

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState(1); // 1: Cart, 2: Address, 3: Payment, 4: Summary
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(saved);
  }, []);

  const removeItem = (id) => {
    const newCart = cart.filter((i) => i._id !== id);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const total = cart.reduce(
    (sum, p) =>
      sum +
      (p.sale > 0 ? (p.price - p.price * (p.sale / 100)) * p.count : p.price * p.count),
    0
  );

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <Text fw={700} size="xl" mb="md">
        🛒 One-Page Checkout
      </Text>

      {/* Step Indicators */}
      <Group mb="md">
        <Text fw={700} color={step === 1 ? "blue" : "dimmed"}>1️⃣ Savat</Text>
        <Text fw={700} color={step === 2 ? "blue" : "dimmed"}>2️⃣ Manzil</Text>
        <Text fw={700} color={step === 3 ? "blue" : "dimmed"}>3️⃣ To‘lov</Text>
        <Text fw={700} color={step === 4 ? "blue" : "dimmed"}>4️⃣ Yakuniy</Text>
      </Group>

      {/* Step 1: Cart */}
      {step === 1 && (
        <>
          <Stack spacing="sm">
            {cart.length === 0 && <Text align="center" color="dimmed">Savat bo'sh</Text>}
            {cart.map((item) => (
              <Card
                key={item._id}
                p="sm"
                radius="md"
                withBorder
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <Group align="center" spacing="sm">
                  <Image src={item.image} height={80} width={80} fit="cover" radius="md" />
                  <Box>
                    <Text fw={600}>{item.name}</Text>
                    <Text size="sm" color="dimmed">
                      {item.sale > 0
                        ? (item.price - item.price * (item.sale / 100)).toLocaleString()
                        : item.price.toLocaleString()}{" "}
                      $ x {item.count}
                    </Text>
                  </Box>
                  {item.sale > 0 && <Badge color="red" variant="light">-{item.sale}%</Badge>}
                  {item.fast && <Badge color="yellow" variant="light">FAST</Badge>}
                  {item.original && <Badge color="green" variant="light">ORIGINAL</Badge>}
                </Group>
                <Button
                  color="red"
                  variant="outline"
                  size="xs"
                  onClick={() => removeItem(item._id)}
                >
                  O‘chirish
                </Button>
              </Card>
            ))}
          </Stack>
          {cart.length > 0 && (
            <Group mt="md" position="apart">
              <Text fw={700}>Jami: {total.toLocaleString()} $</Text>
              <Button style={{ background: "#7000FF" }} onClick={nextStep}>
                Keyingi: Manzil
              </Button>
            </Group>
          )}
        </>
      )}

      {/* Step 2: Address */}
      {step === 2 && (
        <>
          <TextInput
            label="Ism Familiya"
            placeholder="Ismingizni kiriting"
            value={name}
            onChange={(e) => setName(e.target.value)}
            mb="sm"
            required
          />
          <TextInput
            label="Manzil"
            placeholder="Ko‘cha, shahar, pochta indeksi"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            mb="sm"
            required
          />
          <Group mt="md">
            <Button variant="outline" onClick={prevStep}>⬅ Orqaga</Button>
            <Button style={{ background: "#7000FF" }} onClick={nextStep}>
              Keyingi: To‘lov
            </Button>
          </Group>
        </>
      )}

      {/* Step 3: Payment */}
      {step === 3 && (
        <>
          <Select
            label="To‘lov usuli"
            placeholder="Usulni tanlang"
            value={payment}
            onChange={setPayment}
            data={[
              { value: "card", label: "Karta orqali" },
              { value: "paypal", label: "PayPal" },
              { value: "cash", label: "Naqd" },
            ]}
            mb="sm"
            required
          />
          <Group mt="md">
            <Button variant="outline" onClick={prevStep}>⬅ Orqaga</Button>
            <Button style={{ background: "#7000FF" }} onClick={nextStep}>
              Keyingi: Yakuniy
            </Button>
          </Group>
        </>
      )}

      {/* Step 4: Summary */}
      {step === 4 && (
        <>
          <Text fw={700} size="lg" mb="sm">Yakuniy tasdiqlash</Text>
          <Stack spacing="sm">
            {cart.map((item) => (
              <Text key={item._id}>
                {item.name} x {item.count} ={" "}
                {item.sale > 0
                  ? ((item.price - item.price * (item.sale / 100)) * item.count).toLocaleString()
                  : (item.price * item.count).toLocaleString()}{" "}
                $
              </Text>
            ))}
          </Stack>
          <Divider my="sm" />
          <Text fw={700} size="lg">Jami: {total.toLocaleString()} $</Text>
          <Group mt="md">
            <Button variant="outline" onClick={prevStep}>⬅ Orqaga</Button>
            <Button style={{ background: "#7000FF" }} onClick={() => alert("Checkout muvaffaqiyatli!")}>
              To‘lovga o‘tish
            </Button>
          </Group>
        </>
      )}
    </div>
  );
};

export default Checkout;
