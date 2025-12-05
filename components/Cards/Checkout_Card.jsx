"use client";

import React, { useEffect, useState } from "react";
import { Text, Button, Group, Card, Image } from "@mantine/core";
import { useRouter } from "next/navigation";

const Checkout = () => {
  const router = useRouter();
  const [cart, setCart] = useState([]);

  // LocalStorage’dan savatni olish
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(saved);
  }, []);

  // Mahsulotni o‘chirish
  const removeItem = (id) => {
    const newCart = cart.filter((i) => i._id !== id);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  // Jami narxni hisoblash
  const total = cart.reduce(
    (sum, p) =>
      sum +
      (p.sale > 0 ? (p.price - p.price * (p.sale / 100)) * p.count : p.price * p.count),
    0
  );

  return (
    <div style={{ padding: 20 }}>
      <Text fw={700} size="xl" mb="md">
        Savat
      </Text>

      {cart.length === 0 && <Text>Savat bo'sh</Text>}

      {cart.map((item) => (
        <Card key={item._id} mb="sm" withBorder radius="md">
          <Group position="apart" align="center">
            <Group>
              <Image src={item.image} height={60} width={60} fit="cover" />
              <div>
                <Text fw={600}>{item.name}</Text>
                <Text size="sm">
                  {item.sale > 0
                    ? (item.price - item.price * (item.sale / 100)).toLocaleString()
                    : item.price.toLocaleString()}{" "}
                  $ x {item.count}
                </Text>
              </div>
            </Group>
            <Button color="red" size="xs" onClick={() => removeItem(item._id)}>
              O‘chirish
            </Button>
          </Group>
        </Card>
      ))}

      {cart.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <Text fw={700} size="lg" mb="sm">
            Jami: {total.toLocaleString()} $
          </Text>
          <Button
            fullWidth
            radius="md"
            style={{ background: "#7000FF" }}
            onClick={() => alert("Checkout muvaffaqiyatli!")}
          >
            To‘lovga o‘tish
          </Button>
          <Button
            fullWidth
            radius="md"
            mt="sm"
            variant="outline"
            onClick={() => router.push("/")}
          >
            Mahsulotlarga qaytish
          </Button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
