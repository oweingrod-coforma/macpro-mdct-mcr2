import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { ReportContext, DashboardPage } from "components";
// utils
import {
  mockAdminUser,
  mockHelpDeskUser,
  mockStateApprover,
  mockStateRep,
  mockNoUser,
  mockStateUser,
  mockReportContext,
  RouterWrappedComponent,
  mockReport,
} from "utils/testing/setupJest";
import { useBreakpoint, makeMediaQueryClasses, useUser } from "utils";
// verbiage
import verbiage from "verbiage/pages/mcpar/mcpar-dashboard";

window.HTMLElement.prototype.scrollIntoView = jest.fn();

jest.mock("utils/auth/useUser");
const mockedUseUser = useUser as jest.MockedFunction<typeof useUser>;

jest.mock("utils/other/useBreakpoint");
const mockUseBreakpoint = useBreakpoint as jest.MockedFunction<
  typeof useBreakpoint
>;
const mockMakeMediaQueryClasses = makeMediaQueryClasses as jest.MockedFunction<
  typeof makeMediaQueryClasses
>;

const mockUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: jest.fn(() => ({
    pathname: "/mcpar",
  })),
}));

const mockReportContextNoReports = {
  ...mockReportContext,
  reportsByState: undefined,
};

const mockReportContextWithError = {
  ...mockReportContext,
  errorMessage: "test error",
};

const mockDashboardReportContext = {
  ...mockReportContext,
  reportsByState: [
    {
      ...mockReport,
      formTemplate: undefined,
      fieldData: undefined,
    },
  ],
};

const dashboardViewWithReports = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockDashboardReportContext}>
      <DashboardPage reportType="MOCK" />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const dashboardViewNoReports = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContextNoReports}>
      <DashboardPage reportType="MOCK" />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const dashboardViewWithError = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContextWithError}>
      <DashboardPage reportType="MOCK" />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test Dashboard view (with reports, desktop view)", () => {
  beforeEach(async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    mockUseBreakpoint.mockReturnValue({
      isMobile: false,
    });
    mockMakeMediaQueryClasses.mockReturnValue("desktop");
    await act(async () => {
      await render(dashboardViewWithReports);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Check that Dashboard view renders", () => {
    expect(screen.getByText(verbiage.intro.header)).toBeVisible();
    expect(screen.getByTestId("desktop-table")).toBeVisible();
    expect(screen.queryByText(verbiage.body.empty)).not.toBeInTheDocument();
  });

  test("Clicking 'Enter' button on a report row fetches the field data, then navigates to report", async () => {
    mockReportContext.fetchReport.mockReturnValueOnce(mockReport);
    const enterReportButton = screen.getAllByText("Enter")[0];
    expect(enterReportButton).toBeVisible();
    await userEvent.click(enterReportButton);
    expect(mockReportContext.setReportSelection).toHaveBeenCalledTimes(1);
    expect(mockUseNavigate).toBeCalledTimes(1);
    expect(mockUseNavigate).toBeCalledWith("/mock/mock-route-1");
  });

  test("Clicking 'Add a Program' button opens the AddEditProgramModal", async () => {
    const addProgramButton = screen.getByText(verbiage.body.callToAction);
    expect(addProgramButton).toBeVisible();
    await userEvent.click(addProgramButton);
    await expect(screen.getByTestId("add-edit-program-form")).toBeVisible();
  });

  test("Clicking 'Edit Program' icon opens the AddEditProgramModal", async () => {
    const addProgramButton = screen.getAllByAltText("Edit Program")[0];
    expect(addProgramButton).toBeVisible();
    await userEvent.click(addProgramButton);
    await expect(screen.getByTestId("add-edit-program-form")).toBeVisible();
  });
});

describe("Test Dashboard view (with reports, mobile view)", () => {
  beforeEach(async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    mockUseBreakpoint.mockReturnValue({
      isMobile: true,
    });
    mockMakeMediaQueryClasses.mockReturnValue("mobile");
    await act(async () => {
      await render(dashboardViewWithReports);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Dashboard view renders", () => {
    expect(screen.getByText(verbiage.intro.header)).toBeVisible();
    expect(screen.getAllByTestId("mobile-row")[0]).toBeVisible();
    expect(screen.queryByText(verbiage.body.empty)).not.toBeInTheDocument();
  });

  test("Clicking 'Enter' button on a report navigates to first page of report", async () => {
    mockReportContext.fetchReport.mockReturnValueOnce(mockReport);
    const enterReportButton = screen.getAllByText("Enter")[0];
    expect(enterReportButton).toBeVisible();
    await userEvent.click(enterReportButton);
    expect(mockUseNavigate).toBeCalledTimes(1);
    expect(mockUseNavigate).toBeCalledWith("/mock/mock-route-1");
  });

  test("Clicking 'Add a Program' button opens the AddEditProgramModal", async () => {
    const addProgramButton = screen.getByText(verbiage.body.callToAction);
    expect(addProgramButton).toBeVisible();
    await userEvent.click(addProgramButton);
    await expect(screen.getByTestId("add-edit-program-form")).toBeVisible();
  });

  test("Clicking 'Edit Program' icon opens the AddEditProgramModal", async () => {
    const addProgramButton = screen.getAllByAltText("Edit Program")[0];
    expect(addProgramButton).toBeVisible();
    await userEvent.click(addProgramButton);
    await expect(screen.getByTestId("add-edit-program-form")).toBeVisible();
  });
});

describe("Test Dashboard report archiving privileges (desktop)", () => {
  beforeEach(() => {
    mockUseBreakpoint.mockReturnValue({
      isMobile: false,
    });
    mockMakeMediaQueryClasses.mockReturnValue("desktop");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Admin user can archive reports", async () => {
    mockedUseUser.mockReturnValue(mockAdminUser);
    await act(async () => {
      await render(dashboardViewWithReports);
    });
    const archiveProgramButton = screen.getAllByText("Archive")[0];
    expect(archiveProgramButton).toBeVisible();
    await userEvent.click(archiveProgramButton);
    await expect(mockReportContext.archiveReport).toHaveBeenCalledTimes(1);
    // once for render, once for archive
    await expect(mockReportContext.fetchReportsByState).toHaveBeenCalledTimes(
      2
    );
  });

  test("Help desk user cannot archive reports", async () => {
    mockedUseUser.mockReturnValue(mockHelpDeskUser);
    await act(async () => {
      await render(dashboardViewWithReports);
    });
    expect(screen.queryByAltText("Archive")).toBeNull();
  });

  test("State approver cannot archive reports", async () => {
    mockedUseUser.mockReturnValue(mockStateApprover);
    await act(async () => {
      await render(dashboardViewWithReports);
    });
    expect(screen.queryByAltText("Archive")).toBeNull();
  });

  test("State user cannot archive reports", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    await act(async () => {
      await render(dashboardViewWithReports);
    });
    expect(screen.queryByAltText("Archive")).toBeNull();
  });

  test("State rep cannot archive reports", async () => {
    mockedUseUser.mockReturnValue(mockStateRep);
    await act(async () => {
      await render(dashboardViewWithReports);
    });
    expect(screen.queryByAltText("Archive")).toBeNull();
  });
});

describe("Test Dashboard report archiving privileges (mobile)", () => {
  beforeEach(() => {
    mockUseBreakpoint.mockReturnValue({
      isMobile: true,
    });
    mockMakeMediaQueryClasses.mockReturnValue("mobile");
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Admin user can archive reports", async () => {
    mockedUseUser.mockReturnValue(mockAdminUser);
    await act(async () => {
      await render(dashboardViewWithReports);
    });
    const archiveProgramButton = screen.getAllByText("Archive")[0];
    expect(archiveProgramButton).toBeVisible();
    await userEvent.click(archiveProgramButton);
    await expect(mockReportContext.archiveReport).toHaveBeenCalledTimes(1);
    // once for render, once for archive
    await expect(mockReportContext.fetchReportsByState).toHaveBeenCalledTimes(
      2
    );
  });

  test("Help desk user cannot archive reports", async () => {
    mockedUseUser.mockReturnValue(mockHelpDeskUser);
    await act(async () => {
      await render(dashboardViewWithReports);
    });
    expect(screen.queryByAltText("Archive")).toBeNull();
  });

  test("State approver cannot archive reports", async () => {
    mockedUseUser.mockReturnValue(mockStateApprover);
    await act(async () => {
      await render(dashboardViewWithReports);
    });
    expect(screen.queryByAltText("Archive")).toBeNull();
  });

  test("State user cannot archive reports", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    await act(async () => {
      await render(dashboardViewWithReports);
    });
    expect(screen.queryByAltText("Archive")).toBeNull();
  });

  test("State rep cannot archive reports", async () => {
    mockedUseUser.mockReturnValue(mockStateRep);
    await act(async () => {
      await render(dashboardViewWithReports);
    });
    expect(screen.queryByAltText("Archive")).toBeNull();
  });
});

describe("Test Dashboard with no activeState", () => {
  test("Dashboard reroutes to / with no active state", async () => {
    mockedUseUser.mockReturnValue(mockNoUser);
    await act(async () => {
      await render(dashboardViewWithReports);
    });
    expect(mockUseNavigate).toBeCalledWith("/");
  });
});

describe("Test Dashboard (without reports)", () => {
  beforeEach(async () => {
    mockUseBreakpoint.mockReturnValue({
      isMobile: false,
    });
    mockMakeMediaQueryClasses.mockReturnValue("desktop");
    await act(async () => {
      await render(dashboardViewNoReports);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("dashboard renders table with empty text", () => {
    expect(screen.getByText(verbiage.body.empty)).toBeVisible();
  });
});

describe("Test Dashboard with error", () => {
  test("Error alert shows when there is an error", async () => {
    mockUseBreakpoint.mockReturnValue({
      isMobile: false,
      isTablet: false,
    });
    mockedUseUser.mockReturnValue(mockStateUser);
    await act(async () => {
      await render(dashboardViewWithError);
    });
    expect(screen.getByText("test error")).toBeVisible();
  });
});

describe("Test Dashboard view accessibility", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should not have basic accessibility issues (desktop)", async () => {
    mockUseBreakpoint.mockReturnValue({
      isMobile: false,
    });
    mockMakeMediaQueryClasses.mockReturnValue("desktop");
    await act(async () => {
      const { container } = render(dashboardViewWithReports);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  it("Should not have basic accessibility issues (mobile)", async () => {
    mockUseBreakpoint.mockReturnValue({
      isMobile: true,
    });
    mockMakeMediaQueryClasses.mockReturnValue("mobile");
    await act(async () => {
      const { container } = render(dashboardViewWithReports);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
