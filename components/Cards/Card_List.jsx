"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Image,
  Text,
  Button,
  Group,
  Grid,
  Skeleton,
  Modal,
  TextInput,
  Select,
} from "@mantine/core";
import { useRouter } from "next/navigation"; // Next.js router

const App = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [modalItem, setModalItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");

  const itemsPerPage = 8;

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch(
        "https://web-bot-node-bqye.onrender.com/api/products"
      );
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

      // Restore cart from localStorage
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const merged = fixed.map((item) => {
        const savedItem = savedCart.find((i) => i._id === item._id);
        return savedItem ? { ...item, added: true, count: savedItem.count } : item;
      });

      setItems(merged);
      setLoading(false);
    } catch (err) {
      console.log("API ERROR:", err);
      setError("API bilan bog'lanishda xatolik yuz berdi.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // LocalStorage update
  useEffect(() => {
    const cartItems = items.filter((i) => i.added);
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [items]);

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

  // Filter & search
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category ? item.category === category : true;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const cartTotal = items
    .filter((i) => i.added)
    .reduce(
      (sum, p) =>
        sum +
        (p.sale > 0
          ? (p.price - p.price * (p.sale / 100)) * p.count
          : p.price * p.count),
      0
    );

  return (
    <div style={{ padding: 20, paddingBottom: 120 }}>
      {/* Search & Filter */}
      <Group mb="md" spacing="sm">
        <TextInput
          placeholder="Qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />
        {/* <Select
          placeholder="Kategoriya"
          value={category}
          onChange={setCategory}
          data={[...new Set(items.map((i) => i.category))].map((c) => ({
            value: c,
            label: c,
          }))}
          style={{ width: 200 }}
         /> */}
      </Group>

      {/* Error */}
      {error && (
        <Text color="red" mb="md">
          {error}
        </Text>
      )}

      <Grid gutter="md">
        {/* Skeleton loader */}
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

        {/* Products */}
        {!loading &&
          paginatedItems.map((item) => (
            <Grid.Col key={item._id} span={{ base: 12, sm: 6, lg: 3 }}>
              <Card withBorder radius="lg" padding="sm">
                <Card.Section>
                  <div
                    style={{ position: "relative", cursor: "pointer" }}
                    onClick={() => setModalItem(item)}
                  >
                    <Image src={item.image} height={230} fit="cover" />

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
                          fontFamily: "fangsong",
                          position: "absolute",
                          top: 10,
                          right: 10,
                          backgroundColor: "rgb(63, 207, 116)",
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

                    {item.fast && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: 10,
                          left: 10,
                          backgroundColor: "#FFD700",
                          color: "black",
                          padding: "2px 6px",
                          fontSize: 10,
                          fontWeight: 700,
                          borderRadius: 6,
                        }}
                      >
                        FAST DELIVERY
                      </div>
                    )}
                  </div>
                </Card.Section>

                <Text fw={600} size="sm" mt="sm" lineClamp={2}>
                  {item.name}
                </Text>

                <Text fw={700} mt={4} size="lg" style={{ color: "#7000FF" }}>
                  {item.sale > 0
                    ? (item.price - item.price * (item.sale / 100)).toLocaleString()
                    : item.price.toLocaleString()}{" "}
                  $
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

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Group mt="md" position="center">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Oldingi
          </Button>
          <Text>
            {currentPage} / {totalPages}
          </Text>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Keyingi
          </Button>
        </Group>
      )}

      {/* Cart total */}
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
  onClick={() => router.push("/checkout")} // ✅ Checkout sahifasiga o'tadi
>
  Rasmiylashtirish
</Button>

        </div>
      )}

      {/* Product Modal */}
      {modalItem && (
        <Modal
          opened={!!modalItem}
          onClose={() => setModalItem(null)}
          title={modalItem.name}
          size="lg"
        >
          <Image src={modalItem.image} height={300} fit="contain" />
          <Text mt="sm">{modalItem.description || "Ma'lumot mavjud emas."}</Text>
          <Text fw={700} mt="sm" size="lg" style={{ color: "#7000FF" }}>
            {modalItem.sale > 0
              ? (modalItem.price - modalItem.price * (modalItem.sale / 100)).toLocaleString()
              : modalItem.price.toLocaleString()}{" "}
            $
          </Text>
        </Modal>
      )}
    </div>
  );
};

export default App;
