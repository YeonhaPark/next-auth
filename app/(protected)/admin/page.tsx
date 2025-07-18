"use client";
import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { adminAction } from "@/actions/admin";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";
const AdminPage = () => {
  const onServerActionClick = async () => {
    adminAction().then((data) => {
      if (data.error) {
        toast.error(data.error);
      }

      if (data.success) {
        toast.success(data.success);
      }
    });
  };
  const onApiRouteClick = () => {
    fetch("/api/admin").then((response) => {
      if (response.ok) {
        toast.success("API call successful!");
      } else {
        toast.error("You are not allowed to access this API.");
      }
    });
  };
  return (
    <Card className="w-[600px]">
      <CardHeader className="flex justify-center text-2xl font-semibold">
        <p>🔑 Admin</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <FormSuccess message="You are allowed to see this content" />
        </RoleGate>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Server Action</p>
          <Button onClick={onServerActionClick}>Click to test</Button>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only APIs</p>
          <Button onClick={onApiRouteClick}>Click to test</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPage;
