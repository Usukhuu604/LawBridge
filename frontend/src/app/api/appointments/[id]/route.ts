import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: appointmentId } = await params;
    const body = await request.json();
    const { status } = body;

    // Validate status
    const validStatuses = ["PENDING", "COMPLETED", "CANCELLED"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          message:
            "Invalid status. Must be one of: PENDING, COMPLETED, CANCELLED",
        },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Verify the appointment exists
    // 2. Check if the user has permission to update this appointment
    // 3. Update the appointment status in your database

    // For now, we'll simulate a successful response
    const updatedAppointment = {
      _id: appointmentId,
      status,
      updatedAt: new Date().toISOString(),
    };

    // TODO: Replace with actual database operations
    console.log("Appointment updated:", updatedAppointment);

    return NextResponse.json(
      {
        message: "Appointment status updated successfully",
        appointment: updatedAppointment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
