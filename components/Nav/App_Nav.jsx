import { Button, Container, Flex, ScrollArea } from "@mantine/core";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());
const App_Nav = () => {
  const { id } = useParams();
  const { data, error, isLoading } = useSWR(
    "https://web-bot-node-bqye.onrender.com/api/categories",
    fetcher
  );

  if (error) return <Container>ошибка загрузки</Container>;
  if (isLoading) return <Container>загрузка...</Container>;
  return (
    <>

    
<ScrollArea w="100%">
  <Container size="xl" pt="xs">
    <Flex
      gap="sm"
      justify={{ base: "center", sm: "flex-start" }}
      wrap="wrap"
      w="100%"
    >
      <Link href={`/`}>
        <Button variant="light">Home</Button>
      </Link>

      {data.map((item) => (
        <Link key={item._id} href={`/category/${item._id}`}>
          <Button variant={id == item._id ? "filled" : "light"}>
            {item.name}
          </Button>
        </Link>
      ))}
    </Flex>
  </Container>
</ScrollArea>

    </>
  );
};

export default App_Nav;
