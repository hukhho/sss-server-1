import { Table } from "@medusajs/ui";
import { Sun } from "@medusajs/icons";
import { useAdminCustomQuery, useProducts } from "medusa-react";
import { useParams } from "react-router-dom";
import { Product } from "@medusajs/medusa";

type AdminDeposit = {
  id: string;
  user_id: string;
};
type AdminDepositQuery = {
  expand?: string;
  fields?: string;
};
type AdminDepositRes = {
  deposits: AdminDeposit[];
};

const depositsData = {
  deposits: [
    {
      id: "des_ccwcw",
      created_at: "2023-10-17T13:06:30.441Z",
      updated_at: "2023-10-17T13:06:30.441Z",
      user_id: "usr_01HBHY5BR4DWZVC4W180YQ753N",
      customer_id: null,
      coin_amount: "200000.00",
      fiat_type: "vnd",
      fiat_amount: "200000.00",
      method: "BANK",
      status: "PENDING",
      note: "3889999999996",
      txn: "33131",
      typeTrans: "DEPOSIT",
      revicedName: "BUI XUAN HUNG",
      revicedBankName: "MB BANK",
      revicedBankNumber: "3889999999996",
    },
    // Add more deposit objects here if needed
  ],
};

const DepositTable = () => {
  const deposits = depositsData.deposits;
  const handleApproveClick = (id) => {
    console.log(`Approved deposit with ID: ${id}`);
  };
  const { data, isLoading } = useAdminCustomQuery<
    AdminDepositQuery,
    AdminDepositRes
  >(
    `/custom/test`, // path
    ["deposits", "list"], // queryKey
    {}
  );

  return (
    <div>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Created At</Table.HeaderCell>
            <Table.HeaderCell>Updated At</Table.HeaderCell>
            <Table.HeaderCell>User ID</Table.HeaderCell>
            <Table.HeaderCell>Customer ID</Table.HeaderCell>
            <Table.HeaderCell>Coin Amount</Table.HeaderCell>
            <Table.HeaderCell>Fiat Type</Table.HeaderCell>
            <Table.HeaderCell>Fiat Amount</Table.HeaderCell>
            <Table.HeaderCell>Method</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Note</Table.HeaderCell>
            <Table.HeaderCell>Transaction</Table.HeaderCell>
            <Table.HeaderCell>Type of Transaction</Table.HeaderCell>
            <Table.HeaderCell>Received Name</Table.HeaderCell>
            <Table.HeaderCell>Received Bank Name</Table.HeaderCell>
            <Table.HeaderCell>Received Bank Number</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {deposits.map((deposit) => (
            <Table.Row key={deposit.id}>
              <Table.Cell>{deposit.id}</Table.Cell>
              <Table.Cell>{deposit.created_at}</Table.Cell>
              <Table.Cell>{deposit.updated_at}</Table.Cell>
              <Table.Cell>{deposit.user_id}</Table.Cell>
              <Table.Cell>{deposit.customer_id}</Table.Cell>
              <Table.Cell>{deposit.coin_amount}</Table.Cell>
              <Table.Cell>{deposit.fiat_type}</Table.Cell>
              <Table.Cell>{deposit.fiat_amount}</Table.Cell>
              <Table.Cell>{deposit.method}</Table.Cell>
              <Table.Cell>{deposit.status}</Table.Cell>
              <Table.Cell>{deposit.note}</Table.Cell>
              <Table.Cell>{deposit.txn}</Table.Cell>
              <Table.Cell>{deposit.typeTrans}</Table.Cell>
              <Table.Cell>{deposit.revicedName}</Table.Cell>
              <Table.Cell>{deposit.revicedBankName}</Table.Cell>
              <Table.Cell>{deposit.revicedBankNumber}</Table.Cell>
              <Table.Cell>
                <button onClick={() => handleApproveClick(deposit.id)}>
                  Approve
                </button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export const config = {
  link: {
    label: "Deposit Table",
    icon: Sun,
  },
};

export default DepositTable;
