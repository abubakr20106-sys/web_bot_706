"use client"

import React, { useState, useEffect } from "react";
import {
  Card,
  Image,
  Text,
  Button,
  Group,
  Grid,
  Skeleton,
} from "@mantine/core";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("https://web-bot-node-bqye.onrender.com/api/products");
      const apiData = await res.json();

      const fixed = apiData.map((p) => ({
        ...p,
        sale: p.sale ?? 0,
        old_price: p.old_price ?? p.price,
        fast: p.fast ?? false,
        image: p.image ?? "/no-image.png",
        original: p.original ?? true,
        added: false,
        count: 1,
      }));

      setItems(fixed);
      setLoading(false);
    } catch (err) {
      console.log("API ERROR:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, added: true, count: 1 } : item
      )
    );
  };

  const plus = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, count: item.count + 1 } : item
      )
    );
  };

  const minus = (id) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item._id === id) {
          if (item.count > 1) return { ...item, count: item.count - 1 };
          return { ...item, added: false };
        }
        return item;
      })
    );
  };

  const cartTotal = items
    .filter((i) => i.added)
    .reduce((sum, p) => sum + p.price * p.count, 0);

  return (
    <div style={{ padding: 20, paddingBottom: 120 }}>
      <Grid gutter="md">

        {/* ==== Skeleton loader ==== */}
        {loading &&
          Array(6)
            .fill(0)
            .map((_, i) => (
              <Grid.Col key={i} span={{ base: 12, sm: 6, lg: 3 }}>
                <Card withBorder radius="lg" padding="sm">
                  <Skeleton height={230} />
                  <Skeleton mt="md" height={14} width="80%" />
                  <Skeleton mt="sm" height={14} width="60%" />
                  <Skeleton mt="md" height={20} width="40%" />
                  <Skeleton mt="md" height={44} radius="md" />
                </Card>
              </Grid.Col>
            ))}

        {/* ==== Products ==== */}
        {!loading &&
          items.map((item) => (
            <Grid.Col key={item._id} span={{ base: 12, sm: 6, lg: 3 }}>
              <Card withBorder radius="lg" padding="sm">
                <Card.Section>
                  <div style={{ position: "relative" }}>
                    <Image
                      src={item.image}
                      height={230}
                      fit="cover"
                    />

                    {item.sale > 0 && (
                      <div
                        style={{
                          position: "absolute",
                          top: 10,
                          left: 10,
                          background: "#FF003D",
                          color: "white",
                          padding: "4px 10px",
                          fontSize: 12,
                          fontWeight: 700,
                          borderRadius: 8,
                        }}
                      >
                        -{item.sale}%
                      </div>
                    )}

                    {item.original && (
                      <div
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          background: "#00C74D",
                          color: "white",
                          padding: "4px 10px",
                          fontSize: 8,
                          fontWeight: 800,
                          borderRadius: 8,
                        }}
                      >
                        ORIGINAL
                      </div>
                    )}
                  </div>
                </Card.Section>

                <Text fw={600} size="sm" mt="sm" lineClamp={2}>
                  {item.name}
                </Text>

                {item.fast && (
                  <Text size="xs" fw={600} style={{ color: "#FF6A00" }}>
                    Tezkor yetkazib beriladi 🚀
                  </Text>
                )}

                <Text fw={700} mt={4} size="lg" style={{ color: "#7000FF" }}>
                  {item.price.toLocaleString()} $
                </Text>

                {item.sale > 0 && (
                  <Text
                    size="xs"
                    mt={-2}
                    style={{
                      textDecoration: "line-through",
                      opacity: 0.5,
                    }}
                  >
                    {item.old_price.toLocaleString()} $
                  </Text>
                )}

                <Group mt="sm" grow>
                  {!item.added ? (
                    <Button
                      fullWidth
                      radius="md"
                      style={{
                        background: "#7000FF",
                        height: 42,
                        fontWeight: 600,
                      }}
                      onClick={() => addToCart(item._id)}
                    >
                      Savatga qo‘shish
                    </Button>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        height: 42,
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0 14px",
                        background: "#F7F4FF",
                        borderRadius: 12,
                        border: "1px solid #E0D6FF",
                        fontSize: 18,
                        fontWeight: 600,
                      }}
                    >
                      <span
                        onClick={() => minus(item._id)}
                        style={{
                          fontSize: 22,
                          cursor: "pointer",
                          color: "#7000FF",
                        }}
                      >
                        –
                      </span>

                      {item.count}

                      <span
                        onClick={() => plus(item._id)}
                        style={{
                          fontSize: 22,
                          cursor: "pointer",
                          color: "#7000FF",
                        }}
                      >
                        +
                      </span>
                    </div>
                  )}
                </Group>
              </Card>
            </Grid.Col>
          ))}
      </Grid>

      {cartTotal > 0 && (
        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            background: "white",
            padding: "14px 16px",
            borderTop: "1px solid #E5E5E5",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <Text fw={700} size="lg">
            {cartTotal.toLocaleString()} $
          </Text>
          <Button
            radius="md"
            style={{
              background: "#7000FF",
              padding: "12px 24px",
              fontWeight: 600,
            }}
          >
            Rasmiylashtirish
          </Button>
        </div>
      )}
    </div>
  );
};

export default App;
