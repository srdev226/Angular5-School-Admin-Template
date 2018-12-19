export const mainMenu = [
	{
		name: 'ACADEMIC',
		url: '/academics',
		access: 'ACADEMICS',
		children: [
			{
				name: 'Classes',
				url: '/academics/classes',
				access: 'ACADEMICS_CLASSES',
				children: [
					{
						name: 'Attendance',
						url: '/academics/classes',
						access: 'ACADEMICS_STUDENT_SCORE',
						children: [],
					},
					{
						name: 'Subjects',
						url: '/academics',
						access: 'ACADEMICS_ATTENDENCE',
						children: [],
					},
				],
			},
			{
				name: 'Students',
				url: '/student',
				access: 'STUDENT',
				children: [],
			},
			{
				name: 'Exams',
				url: '/academics/exams',
				access: 'ACADEMICS_EXAMS',
				children: [
					{
						name: 'Exam Schedule',
						url: '/academics/exams',
						access: 'ACADEMICS_EXAMS_ADD',
						children: [],
					},
					{
						name: 'Exam Marking',
						url: '/academics/exams',
						access: 'ACADEMICS_EXAMS_EDIT',
						children: [],
					},
				],
			},
			{
				name: 'Class Report',
				url: '/academics/class_report',
				access: 'ACADEMICS_ATTENDANCE_REPORT',
				children: [],
			},
		]
	},
	{
		name: 'ADMINISTRATIVE',
		url: '',
		access: 'FEE',
		children: [
			{
				name: 'School Fees',
				url: '/fee/fee-bill',
				access: 'FEE_BILLS',
				children: [
					{
						name: 'Fee Collection',
						url: '/fee/fee-bill',
						access: 'FEE_BILLS',
						children: [],
					},{
						name: 'Fee Reports',
						url: '/fee/fee-report',
						access: 'FEE_REPORTS',
						children: [],
					},
				]
			},
			{
				name: 'Transport',
				url: '/transport',
				access: 'TRANSPORT',
				children: [
					{
						name: 'Trips',
						url: '/transport/trips',
						access: 'TRIP_TRANSPORT',
						children: [],
					},{
						name: 'Routes',
						url: '/transport/routes',
						access: 'ROUTES_TRANSPORT',
						children: [],
					},{
						name: 'Vehicles',
						url: '/transport/vehicle',
						access: 'VEHICLE_TRANSPORT',
						children: [],
					}
				],
			},
			{
				name: 'Communication',
				url: '/academics',
				access: 'USER_LIST',
				children: [],
			},
			{
				name: 'Admissions',
				url: '/applications',
				access: 'APPL',
				children: [],
			},
			{
				name: 'Holiday List',
				url: '/academics',
				access: 'USER_LIST',
				children: [],
			},
		]
	},
	{
		name: 'PROFILE MANAGEMENT',
		url: '/manage',
		access: 'FEE',
		children: [
			{
				name: 'Employees',
				url: '/employee',
				access: 'EMPLOYEE',
				children: [],
			},
			{
				name: 'Students',
				url: '/manage',
				access: 'FEE_REPORTS',
				children: [],
			},
			{
				name: 'Parents & Guardians',
				url: '/manage',
				access: 'APPL',
				children: [],
			},
		]
	},
	{
		name: 'ACCOUNT MANAGEMENT',
		url: '/manage',
		access: 'MGMNT',
		children: [
			{
				name: 'School Information',
				url: '/manage',
				access: 'MGMNT_SCHOOL',
				children: [],
			},
			{
				name: 'Fee Rules',
				url: '/manage/fee-rule/list',
				access: 'MGMNT_FEE_RULE',
				children: [],
			},
			{
				name: 'Users',
				url: '/user',
				access: 'USER',
				children: [
					{
						name: 'Users',
						url: '/user/list',
						access: 'USER_LIST',
						children: [],
					},{
						name: 'User Roles',
						url: '/user/user_role',
						access: 'USER_ROLES',
						children: [],
					}
				],
			},
			{
				name: 'Manage Subjects',
				url: '/manage/manage-subjects',
				access: 'EMPLOYEE',
				children: [],
			},	{
				name: 'Curriculum',
				url: '/manage/manage-curriculum',
				access: 'EMPLOYEE',
				children: [],
			}
		]
	}
];

export const subMenu = {
    FEE: ['FEE_BILL', 'FEE_REP'],
    ACADEMICS: ['CLA', 'PRO', 'ATT', 'REP', 'EXM', 'SCR'],
    USER: ['USR_LIST', 'USR_ROLE'],
    MGMNT: ['SCHL', 'FEE_RULE', 'INST', 'SCL_MGNT'],
    TRANSPORT: ['TRAN_TRPS', 'TRAN_RUTS', 'TRAN_VHCL']
  };

export const sMenu = ['FEE', 'ACADEMICS', 'USER', 'MGMNT', 'TRANSPORT'];
