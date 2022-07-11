import {
  Button,
  Container,
  Divider,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { FormEventHandler, useCallback, useState } from "react";

/**
 * List of accepted file types for upload.
 */
const acceptedFileTypes = [".xlsx", ".xls", ".csv"];

function App() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const onSubmit: FormEventHandler<HTMLFormElement> = useCallback((event) => {
    event.preventDefault();

    const data = new FormData(event.target as HTMLFormElement);
  }, []);

  return (
    <Container paddingTop={"16"}>
      <form onSubmit={onSubmit}>
        <HStack alignItems={"flex-start"}>
          <FormControl isInvalid={!!errorMessage}>
            <Input
              required
              accept={acceptedFileTypes.join(", ")}
              id="file"
              type="file"
              name="file"
              paddingTop="1.5"
            />
            <FormErrorMessage>{errorMessage}</FormErrorMessage>
          </FormControl>
          <Button type="submit" colorScheme="red">
            Upload
          </Button>
        </HStack>
      </form>

      <Divider marginY={"5"} />

      <TableContainer>
        <Table variant={"striped"}>
          <Thead>
            <Tr>
              <Th>Song Name</Th>
              <Th>Band</Th>
              <Th isNumeric>Year</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Crazy</Td>
              <Td>Aerosmith</Td>
              <Td isNumeric>1990</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default App;
