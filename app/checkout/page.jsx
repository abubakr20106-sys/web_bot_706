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
} from "@mantine/core";
import { useRouter } from "next/navigation";

const Checkout = () => {
  const router = useRouter();
  const [cart, setCart] = useState([]);

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

  return (
    <div style={{ padding: "20px", maxWidth: 900, margin: "0 auto" }}>
      <Text fw={700} size="xl" mb="md">
        🛒 Savat
      </Text>

      {cart.length === 0 && (
        <Text align="center" color="dimmed">
          Savat bo'sh
        </Text>
      )}

      <Stack spacing="sm">
        {cart.map((item) => (
          <Card
            key={item._id}
            withBorder
            radius="md"
            p="sm"
            style={{ display: "flex", alignItems: "center", gap: 16 }}
          >
            <Image
              src={item.image}
              height={80}
              width={80}
              fit="cover"
              radius="md"
            />

            <div style={{ flex: 1 }}>
              <Group position="apart" align="flex-start">
                <Text fw={600}>{item.name}</Text>

                {item.sale > 0 && (
                  <Badge color="red" variant="filled">
                    -{item.sale}%
                  </Badge>
                )}
              </Group>

              <Text size="sm" color="dimmed" mt={4}>
                {item.sale > 0
                  ? (
                      item.price -
                      item.price * (item.sale / 100)
                    ).toLocaleString()
                  : item.price.toLocaleString()}{" "}
                $ x {item.count}
              </Text>
            </div>

            <Button
              color="red"
              size="xs"
              variant="outline"
              onClick={() => removeItem(item._id)}
            >
              O‘chirish
            </Button>
          </Card>
        ))}
      </Stack>

      {cart.length > 0 && (
        <>
          <Divider my="md" />
          <Group position="apart" mb="md">
            <Text fw={700} size="lg">
              Jami: {total.toLocaleString()} $
            </Text>
            <Button
              radius="md"
              style={{ background: "#7000FF" }}
              onClick={() => alert("Checkout muvaffaqiyatli!")}
            >
              To‘lovga o‘tish
            </Button>
          </Group>
          <Button
            fullWidth
            radius="md"
            variant="outline"
            onClick={() => router.push("/")}
          >
            Mahsulotlarga qaytish
          </Button>
        </>
      )}
    </div>
  );
};

export default Checkout;
