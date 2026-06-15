    const SUPABASE_URL = 'https://ehtrqdxbeqikjmjvmxii.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVodHJxZHhiZXFpa2ptanZteGlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNTgyNzIsImV4cCI6MjA5NjkzNDI3Mn0.qYzsWqJnxyMLlUU9dN6q1enAKwlwo3MnwZRn_DLcPxk';

    const supabaseClient = window.supabase?.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const overlay = document.querySelector('#overlay');
    const editor = document.querySelector('#editor');
    const list = document.querySelector('#containerList');
    const userEmail = document.querySelector('#userEmail');
    const logoutButton = document.querySelector('#logoutButton');
    const yardTabs = document.querySelector('#yardTabs');
    const yardTitle = document.querySelector('#yardTitle');
    const activeYardName = document.querySelector('#activeYardName');
    const planImage = document.querySelector('#planImage');
    const plan = document.querySelector('#plan');

    let selectedId = null;
    let yardId = null;
    let state = {};
    let currentSession = null;
    let currentYardKey = localStorage.getItem('active-yard-key') || 'newtown';

    const NEWTOWN_CONTAINERS = [
      { id: 'C-001', x: 4424, y: 17, width: 63, height: 35 },
      { id: 'C-002', x: 2465, y: 29, width: 32, height: 63 },
      { id: 'C-003', x: 2502, y: 29, width: 34, height: 63 },
      { id: 'C-004', x: 2541, y: 29, width: 34, height: 63 },
      { id: 'C-005', x: 2580, y: 29, width: 32, height: 63 },
      { id: 'C-006', x: 2945, y: 41, width: 39, height: 111 },
      { id: 'C-007', x: 2989, y: 41, width: 42, height: 111 },
      { id: 'C-008', x: 3036, y: 41, width: 42, height: 111 },
      { id: 'C-009', x: 3083, y: 41, width: 42, height: 111 },
      { id: 'C-010', x: 3130, y: 41, width: 41, height: 111 },
      { id: 'C-011', x: 3176, y: 41, width: 42, height: 111 },
      { id: 'C-012', x: 3223, y: 41, width: 42, height: 111 },
      { id: 'C-013', x: 3270, y: 41, width: 42, height: 111 },
      { id: 'C-014', x: 3317, y: 41, width: 41, height: 111 },
      { id: 'C-015', x: 3363, y: 41, width: 42, height: 111 },
      { id: 'C-016', x: 3410, y: 41, width: 42, height: 111 },
      { id: 'C-017', x: 3457, y: 41, width: 42, height: 111 },
      { id: 'C-018', x: 3504, y: 41, width: 41, height: 111 },
      { id: 'C-019', x: 3550, y: 41, width: 42, height: 111 },
      { id: 'C-020', x: 3597, y: 41, width: 42, height: 111 },
      { id: 'C-021', x: 3644, y: 41, width: 42, height: 111 },
      { id: 'C-022', x: 3691, y: 41, width: 41, height: 111 },
      { id: 'C-023', x: 3737, y: 41, width: 42, height: 111 },
      { id: 'C-024', x: 3784, y: 41, width: 42, height: 111 },
      { id: 'C-025', x: 3831, y: 41, width: 42, height: 111 },
      { id: 'C-026', x: 3878, y: 41, width: 41, height: 111 },
      { id: 'C-027', x: 3924, y: 41, width: 42, height: 111 },
      { id: 'C-028', x: 3971, y: 41, width: 42, height: 111 },
      { id: 'C-029', x: 4018, y: 41, width: 42, height: 111 },
      { id: 'C-030', x: 4065, y: 41, width: 41, height: 111 },
      { id: 'C-031', x: 4111, y: 41, width: 42, height: 111 },
      { id: 'C-032', x: 4158, y: 41, width: 42, height: 111 },
      { id: 'C-033', x: 4205, y: 41, width: 42, height: 111 },
      { id: 'C-034', x: 4252, y: 41, width: 40, height: 111 },
      { id: 'C-035', x: 431, y: 44, width: 72, height: 117 },
      { id: 'C-036', x: 508, y: 44, width: 75, height: 117 },
      { id: 'C-037', x: 588, y: 44, width: 74, height: 117 },
      { id: 'C-038', x: 667, y: 44, width: 73, height: 117 },
      { id: 'C-039', x: 2249, y: 50, width: 87, height: 71 },
      { id: 'C-040', x: 2645, y: 53, width: 13, height: 123 },
      { id: 'C-041', x: 2663, y: 53, width: 15, height: 123 },
      { id: 'C-042', x: 2683, y: 53, width: 15, height: 123 },
      { id: 'C-043', x: 2703, y: 53, width: 15, height: 123 },
      { id: 'C-044', x: 2723, y: 53, width: 15, height: 123 },
      { id: 'C-045', x: 2743, y: 53, width: 15, height: 123 },
      { id: 'C-046', x: 2763, y: 53, width: 15, height: 123 },
      { id: 'C-047', x: 2783, y: 53, width: 15, height: 123 },
      { id: 'C-048', x: 2803, y: 53, width: 15, height: 123 },
      { id: 'C-049', x: 2823, y: 53, width: 15, height: 123 },
      { id: 'C-050', x: 2843, y: 53, width: 15, height: 123 },
      { id: 'C-051', x: 2863, y: 53, width: 15, height: 123 },
      { id: 'C-052', x: 2883, y: 53, width: 15, height: 123 },
      { id: 'C-053', x: 2903, y: 53, width: 15, height: 123 },
      { id: 'C-054', x: 2923, y: 53, width: 13, height: 123 },
      { id: 'C-055', x: 4424, y: 57, width: 63, height: 37 },
      { id: 'C-056', x: 4424, y: 99, width: 63, height: 37 },
      { id: 'C-057', x: 2249, y: 126, width: 87, height: 73 },
      { id: 'C-058', x: 4424, y: 141, width: 63, height: 35 },
      { id: 'C-059', x: 161, y: 200, width: 165, height: 65 },
      { id: 'C-060', x: 2249, y: 204, width: 87, height: 71 },
      { id: 'C-061', x: 2033, y: 209, width: 159, height: 57 },
      { id: 'C-062', x: 4391, y: 221, width: 47, height: 51 },
      { id: 'C-063', x: 4443, y: 221, width: 47, height: 51 },
      { id: 'C-064', x: 161, y: 270, width: 165, height: 67 },
      { id: 'C-065', x: 4397, y: 335, width: 99, height: 43 },
      { id: 'C-066', x: 161, y: 342, width: 165, height: 68 },
      { id: 'C-067', x: 2504, y: 347, width: 39, height: 89 },
      { id: 'C-068', x: 2552, y: 347, width: 32, height: 185 },
      { id: 'C-069', x: 2589, y: 347, width: 35, height: 185 },
      { id: 'C-070', x: 2629, y: 347, width: 34, height: 185 },
      { id: 'C-071', x: 2668, y: 347, width: 35, height: 185 },
      { id: 'C-072', x: 2708, y: 347, width: 34, height: 185 },
      { id: 'C-073', x: 2747, y: 347, width: 35, height: 185 },
      { id: 'C-074', x: 2787, y: 347, width: 34, height: 185 },
      { id: 'C-075', x: 2826, y: 347, width: 35, height: 185 },
      { id: 'C-076', x: 2866, y: 347, width: 34, height: 185 },
      { id: 'C-077', x: 2905, y: 347, width: 35, height: 185 },
      { id: 'C-078', x: 2945, y: 347, width: 34, height: 185 },
      { id: 'C-079', x: 2984, y: 347, width: 33, height: 185 },
      { id: 'C-080', x: 3026, y: 347, width: 39, height: 89 },
      { id: 'C-081', x: 2105, y: 365, width: 123, height: 70 },
      { id: 'C-082', x: 4397, y: 383, width: 99, height: 45 },
      { id: 'C-083', x: 2249, y: 395, width: 87, height: 121 },
      { id: 'C-084', x: 161, y: 415, width: 165, height: 67 },
      { id: 'C-085', x: 4397, y: 433, width: 99, height: 45 },
      { id: 'C-086', x: 2105, y: 440, width: 123, height: 72 },
      { id: 'C-087', x: 2504, y: 441, width: 39, height: 91 },
      { id: 'C-088', x: 3026, y: 441, width: 39, height: 91 },
      { id: 'C-089', x: 4397, y: 483, width: 99, height: 45 },
      { id: 'C-090', x: 161, y: 487, width: 165, height: 67 },
      { id: 'C-091', x: 2105, y: 517, width: 123, height: 72 },
      { id: 'C-092', x: 2249, y: 521, width: 87, height: 123 },
      { id: 'C-093', x: 4397, y: 533, width: 99, height: 45 },
      { id: 'C-094', x: 2504, y: 537, width: 39, height: 91 },
      { id: 'C-095', x: 2552, y: 537, width: 32, height: 185 },
      { id: 'C-096', x: 2589, y: 537, width: 35, height: 185 },
      { id: 'C-097', x: 2629, y: 537, width: 34, height: 185 },
      { id: 'C-098', x: 2668, y: 537, width: 35, height: 185 },
      { id: 'C-099', x: 2708, y: 537, width: 34, height: 185 },
      { id: 'C-100', x: 2747, y: 537, width: 35, height: 185 },
      { id: 'C-101', x: 2787, y: 537, width: 34, height: 185 },
      { id: 'C-102', x: 2826, y: 537, width: 35, height: 185 },
      { id: 'C-103', x: 2866, y: 537, width: 34, height: 185 },
      { id: 'C-104', x: 2905, y: 537, width: 35, height: 185 },
      { id: 'C-105', x: 2945, y: 537, width: 34, height: 185 },
      { id: 'C-106', x: 2984, y: 537, width: 33, height: 185 },
      { id: 'C-107', x: 3026, y: 537, width: 39, height: 91 },
      { id: 'C-108', x: 161, y: 559, width: 165, height: 68 },
      { id: 'C-109', x: 4397, y: 583, width: 99, height: 43 },
      { id: 'C-110', x: 2105, y: 594, width: 123, height: 72 },
      { id: 'C-111', x: 161, y: 632, width: 165, height: 67 },
      { id: 'C-112', x: 2504, y: 633, width: 39, height: 89 },
      { id: 'C-113', x: 3026, y: 633, width: 39, height: 89 },
      { id: 'C-114', x: 2249, y: 649, width: 87, height: 124 },
      { id: 'C-115', x: 2105, y: 671, width: 123, height: 72 },
      { id: 'C-116', x: 161, y: 704, width: 165, height: 66 },
      { id: 'C-117', x: 2105, y: 748, width: 123, height: 72 },
      { id: 'C-118', x: 4403, y: 749, width: 99, height: 43 },
      { id: 'C-119', x: 2249, y: 778, width: 87, height: 123 },
      { id: 'C-120', x: 4403, y: 797, width: 99, height: 45 },
      { id: 'C-121', x: 2105, y: 825, width: 123, height: 71 },
      { id: 'C-122', x: 4403, y: 847, width: 99, height: 45 },
      { id: 'C-123', x: 4403, y: 897, width: 99, height: 45 },
      { id: 'C-124', x: 2249, y: 906, width: 87, height: 124 },
      { id: 'C-125', x: 4403, y: 947, width: 99, height: 45 },
      { id: 'C-126', x: 2483, y: 983, width: 39, height: 80 },
      { id: 'C-127', x: 2531, y: 983, width: 33, height: 339 },
      { id: 'C-128', x: 2573, y: 983, width: 32, height: 167 },
      { id: 'C-129', x: 2610, y: 983, width: 32, height: 167 },
      { id: 'C-130', x: 2651, y: 983, width: 33, height: 339 },
      { id: 'C-131', x: 2693, y: 983, width: 33, height: 167 },
      { id: 'C-132', x: 2731, y: 983, width: 36, height: 167 },
      { id: 'C-133', x: 2772, y: 983, width: 35, height: 167 },
      { id: 'C-134', x: 2812, y: 983, width: 36, height: 167 },
      { id: 'C-135', x: 2853, y: 983, width: 35, height: 167 },
      { id: 'C-136', x: 2893, y: 983, width: 36, height: 167 },
      { id: 'C-137', x: 2934, y: 983, width: 35, height: 167 },
      { id: 'C-138', x: 2974, y: 983, width: 34, height: 167 },
      { id: 'C-139', x: 3017, y: 983, width: 39, height: 80 },
      { id: 'C-140', x: 4403, y: 997, width: 99, height: 43 },
      { id: 'C-141', x: 2249, y: 1035, width: 87, height: 123 },
      { id: 'C-142', x: 2483, y: 1068, width: 39, height: 82 },
      { id: 'C-143', x: 3017, y: 1068, width: 39, height: 82 },
      { id: 'C-144', x: 2483, y: 1155, width: 39, height: 82 },
      { id: 'C-145', x: 2573, y: 1155, width: 32, height: 167 },
      { id: 'C-146', x: 2610, y: 1155, width: 32, height: 167 },
      { id: 'C-147', x: 2693, y: 1155, width: 33, height: 167 },
      { id: 'C-148', x: 2731, y: 1155, width: 36, height: 167 },
      { id: 'C-149', x: 2772, y: 1155, width: 35, height: 167 },
      { id: 'C-150', x: 2812, y: 1155, width: 36, height: 167 },
      { id: 'C-151', x: 2853, y: 1155, width: 35, height: 167 },
      { id: 'C-152', x: 2893, y: 1155, width: 36, height: 167 },
      { id: 'C-153', x: 2934, y: 1155, width: 35, height: 167 },
      { id: 'C-154', x: 2974, y: 1155, width: 34, height: 167 },
      { id: 'C-155', x: 3017, y: 1155, width: 39, height: 82 },
      { id: 'C-156', x: 2249, y: 1163, width: 87, height: 123 },
      { id: 'C-157', x: 2483, y: 1242, width: 39, height: 80 },
      { id: 'C-158', x: 3017, y: 1242, width: 39, height: 80 },
      { id: 'C-159', x: 3170, y: 1286, width: 32, height: 96 },
      { id: 'C-160', x: 3207, y: 1286, width: 34, height: 96 },
      { id: 'C-161', x: 3246, y: 1286, width: 34, height: 96 },
      { id: 'C-162', x: 3285, y: 1286, width: 32, height: 96 },
      { id: 'C-163', x: 3461, y: 1286, width: 35, height: 96 },
      { id: 'C-164', x: 3501, y: 1286, width: 38, height: 96 },
      { id: 'C-165', x: 3544, y: 1286, width: 38, height: 96 },
      { id: 'C-166', x: 3587, y: 1286, width: 37, height: 96 },
      { id: 'C-167', x: 3629, y: 1286, width: 38, height: 96 },
      { id: 'C-168', x: 3672, y: 1286, width: 38, height: 96 },
      { id: 'C-169', x: 3715, y: 1286, width: 37, height: 96 },
      { id: 'C-170', x: 3757, y: 1286, width: 38, height: 96 },
      { id: 'C-171', x: 3800, y: 1286, width: 38, height: 96 },
      { id: 'C-172', x: 3843, y: 1286, width: 37, height: 96 },
      { id: 'C-173', x: 3885, y: 1286, width: 38, height: 96 },
      { id: 'C-174', x: 3928, y: 1286, width: 38, height: 96 },
      { id: 'C-175', x: 3971, y: 1286, width: 36, height: 96 },
      { id: 'C-176', x: 2249, y: 1291, width: 87, height: 124 },
      { id: 'C-177', x: 512, y: 1361, width: 145, height: 255 },
      { id: 'C-178', x: 662, y: 1361, width: 147, height: 255 },
      { id: 'C-179', x: 814, y: 1361, width: 148, height: 255 },
      { id: 'C-180', x: 967, y: 1361, width: 147, height: 255 },
      { id: 'C-181', x: 1119, y: 1361, width: 148, height: 255 },
      { id: 'C-182', x: 1272, y: 1361, width: 147, height: 255 },
      { id: 'C-183', x: 1424, y: 1361, width: 147, height: 255 },
      { id: 'C-184', x: 1576, y: 1361, width: 148, height: 255 },
      { id: 'C-185', x: 1729, y: 1361, width: 147, height: 255 },
      { id: 'C-186', x: 1881, y: 1361, width: 146, height: 255 },
      { id: 'C-187', x: 2249, y: 1420, width: 87, height: 123 },
      { id: 'C-188', x: 2657, y: 1511, width: 15, height: 141 },
      { id: 'C-189', x: 2677, y: 1511, width: 18, height: 141 },
      { id: 'C-190', x: 2700, y: 1511, width: 18, height: 141 },
      { id: 'C-191', x: 2723, y: 1511, width: 18, height: 141 },
      { id: 'C-192', x: 2746, y: 1511, width: 18, height: 141 },
      { id: 'C-193', x: 2769, y: 1511, width: 17, height: 141 },
      { id: 'C-194', x: 2791, y: 1511, width: 18, height: 141 },
      { id: 'C-195', x: 2814, y: 1511, width: 18, height: 141 },
      { id: 'C-196', x: 2837, y: 1511, width: 18, height: 141 },
      { id: 'C-197', x: 2860, y: 1511, width: 18, height: 141 },
      { id: 'C-198', x: 2883, y: 1511, width: 17, height: 141 },
      { id: 'C-199', x: 2905, y: 1511, width: 18, height: 141 },
      { id: 'C-200', x: 2928, y: 1511, width: 18, height: 141 },
      { id: 'C-201', x: 2951, y: 1511, width: 18, height: 141 },
      { id: 'C-202', x: 2974, y: 1511, width: 18, height: 141 },
      { id: 'C-203', x: 2997, y: 1511, width: 17, height: 141 },
      { id: 'C-204', x: 3019, y: 1511, width: 18, height: 141 },
      { id: 'C-205', x: 3042, y: 1511, width: 18, height: 141 },
      { id: 'C-206', x: 3065, y: 1511, width: 18, height: 141 },
      { id: 'C-207', x: 3088, y: 1511, width: 16, height: 141 },
      { id: 'C-208', x: 2249, y: 1548, width: 87, height: 122 },
      { id: 'C-209', x: 2483, y: 1589, width: 32, height: 63 },
      { id: 'C-210', x: 2520, y: 1589, width: 34, height: 63 },
      { id: 'C-211', x: 2559, y: 1589, width: 34, height: 63 },
      { id: 'C-212', x: 2598, y: 1589, width: 32, height: 63 },
    ];

    function pad(number) {
      return String(number).padStart(3, '0');
    }

    function cell(id, left, top, right, bottom) {
      return {
        id,
        x: left + 1,
        y: top + 1,
        width: Math.max(1, right - left - 2),
        height: Math.max(1, bottom - top - 2)
      };
    }

    function makeCells(prefix, groups) {
      const cells = [];
      let index = 1;
      groups.forEach((group) => {
        const xs = group.xs;
        const ys = group.ys;
        for (let row = 0; row < ys.length - 1; row += 1) {
          for (let col = 0; col < xs.length - 1; col += 1) {
            cells.push(cell(`${prefix}-${pad(index)}`, xs[col], ys[row], xs[col + 1], ys[row + 1]));
            index += 1;
          }
        }
      });
      return cells;
    }

    const WICKLOW_A_CONTAINERS = makeCells('WA', [
      { xs: [65, 157, 250, 343, 436, 529, 622, 715, 808, 901, 994, 1087, 1180], ys: [33, 105] },
      { xs: [49, 113], ys: [138, 174, 211, 247, 283, 320, 356, 392, 429, 465, 502, 538, 574, 611, 647, 684, 720, 756] },
      { xs: [1180, 1254], ys: [162, 202, 243, 283, 324, 364, 405, 445, 485, 526, 566, 607] },
      { xs: [558, 647, 736], ys: [309, 341, 373, 405, 437, 469, 502, 534, 567] },
      { xs: [405, 506, 607, 708, 809, 910, 1011, 1112], ys: [786, 857] }
    ]);

    const WICKLOW_B_CONTAINERS = makeCells('WB', [
      { xs: [48, 138, 243, 299, 356, 412, 469, 526, 582, 639, 720, 809], ys: [33, 105] },
      { xs: [32, 97], ys: [138, 183, 227, 272, 316, 361, 405, 450, 494, 539, 583, 628, 672, 716] },
      { xs: [1197, 1261], ys: [138, 210] },
      { xs: [1197, 1261], ys: [219, 251, 283, 316, 348, 381, 413, 445, 478, 510, 542, 575, 607, 639, 672, 704] },
      { xs: [526, 615, 704], ys: [309, 341, 373, 405, 437, 469, 502, 534, 567] },
      { xs: [162, 275, 389, 502, 615, 728], ys: [786, 857] },
      { xs: [1197, 1261], ys: [786, 857] }
    ]);

    const yardConfigs = {
      newtown: {
        slug: 'yard1',
        label: 'Newtown Yard',
        image: 'warehouse.png',
        width: 4860,
        height: 1800,
        displayWidth: 'max(1300px, 100%)',
        containers: NEWTOWN_CONTAINERS
      },
      wicklowA: {
        slug: 'yard2',
        label: 'Wicklow Yard A',
        image: 'wicklow-yard-a.jpg',
        width: 1293,
        height: 889,
        displayWidth: 'min(700px, 100%)',
        containers: WICKLOW_A_CONTAINERS
      },
      wicklowB: {
        slug: 'yard3',
        label: 'Wicklow Yard B',
        image: 'wicklow-yard-b.jpg',
        width: 1293,
        height: 889,
        displayWidth: 'min(700px, 100%)',
        containers: WICKLOW_B_CONTAINERS
      }
    };

    function getCurrentYard() {
      return yardConfigs[currentYardKey] || yardConfigs.newtown;
    }

    function getContainers() {
      return getCurrentYard().containers;
    }

    function toDbStatus(status) {
      return status === 'bad-debt' ? 'bad_debt' : status;
    }

    function fromDbStatus(status) {
      return status === 'bad_debt' ? 'bad-debt' : status;
    }

    function rentalStatusFor(containerStatus) {
      if (containerStatus === 'bad-debt') return 'bad_debt';
      if (containerStatus === 'rented') return 'active';
      return 'ended';
    }

    function labelFor(status) {
      return status === 'bad-debt' ? 'Bad debt' : status[0].toUpperCase() + status.slice(1);
    }

    function escapeHtml(value) {
      return String(value || '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
    }

    function containerName(id) {
      return state[id]?.name || id;
    }

    function inferSize(container) {
      const longestSide = Math.max(container.width, container.height);
      if (longestSide < 72) return '10';
      if (longestSide < 150) return '20';
      return '40';
    }

    function labelClassFor(container) {
      const shortestSide = Math.min(container.width, container.height);
      if (shortestSide < 24) return 'tiny';
      if (shortestSide < 42) return 'small';
      return '';
    }

    function showMessage(message) {
      editor.innerHTML = `<p class="empty">${escapeHtml(message)}</p>`;
    }

    function hasValidSupabaseConfig() {
      if (!window.supabase || !supabaseClient) {
        showMessage('Supabase could not load. Check your internet connection and the Supabase script tag in yard1.html.');
        return false;
      }

      if (SUPABASE_ANON_KEY.includes('PASTE_YOUR')) {
        showMessage('Paste your Supabase publishable or anon key into yard1-supabase.js before testing.');
        return false;
      }

      try {
        const [, payload] = SUPABASE_ANON_KEY.split('.');
        const decoded = JSON.parse(atob(payload.replaceAll('-', '+').replaceAll('_', '/')));
        if (decoded.iss !== 'supabase' || decoded.role !== 'anon') {
          showMessage('Supabase key looks incorrect. Paste the publishable or anon key again in yard1-supabase.js.');
          return false;
        }
      } catch (error) {
        showMessage('Supabase key is not valid. Paste the publishable or anon key again in yard1-supabase.js.');
        return false;
      }

      return true;
    }

    async function requireLogin() {
      const { data, error } = await supabaseClient.auth.getSession();
      if (error) throw error;
      if (!data.session) {
        window.location.href = 'login.html';
        return false;
      }
      currentSession = data.session;
      if (userEmail) {
        userEmail.textContent = currentSession.user?.email || 'Signed in';
      }
      return true;
    }

    if (logoutButton) {
      logoutButton.addEventListener('click', async () => {
        logoutButton.disabled = true;
        logoutButton.textContent = 'Logging out...';
        await supabaseClient.auth.signOut();
        window.location.href = 'login.html';
      });
    }

    function renderYardTabs() {
      yardTabs.innerHTML = '';
      Object.entries(yardConfigs).forEach(([key, yard]) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = key === currentYardKey ? 'yard-tab active' : 'yard-tab';
        button.textContent = yard.label;
        button.setAttribute('aria-pressed', key === currentYardKey ? 'true' : 'false');
        button.addEventListener('click', async () => {
          if (key === currentYardKey) return;
          currentYardKey = key;
          localStorage.setItem('active-yard-key', currentYardKey);
          selectedId = null;
          showMessage(`Loading ${yard.label}...`);
          try {
            await refreshFromSupabase();
          } catch (error) {
            showMessage(`Could not load ${yard.label}: ${error.message}`);
          }
        });
        yardTabs.append(button);
      });
    }

    function renderYardShell() {
      const yard = getCurrentYard();
      yardTitle.textContent = yard.label;
      activeYardName.textContent = yard.label;
      document.title = `${yard.label} Container Manager`;
      planImage.src = yard.image;
      planImage.alt = `${yard.label} layout`;
      overlay.setAttribute('viewBox', `0 0 ${yard.width} ${yard.height}`);
      plan.style.setProperty('--plan-width', yard.width);
      plan.style.setProperty('--plan-height', yard.height);
      plan.style.setProperty('--plan-display-width', yard.displayWidth);
      renderYardTabs();
    }

    async function loadYard() {
      const yard = getCurrentYard();
      const { data, error } = await supabaseClient
        .from('yards')
        .select('id, name, slug')
        .eq('slug', yard.slug)
        .single();

      if (error) throw error;
      yardId = data.id;
    }

    async function seedMissingContainers() {
      const rows = getContainers().map((container) => ({
        yard_id: yardId,
        internal_code: container.id,
        display_name: container.id,
        size_ft: Number(inferSize(container)),
        status: 'available'
      }));

      const { error } = await supabaseClient
        .from('containers')
        .upsert(rows, { onConflict: 'yard_id,internal_code', ignoreDuplicates: true });

      if (error) throw error;
    }

    async function loadContainerState() {
      const containers = getContainers();
      const { data, error } = await supabaseClient
        .from('containers')
        .select(`
          id,
          internal_code,
          display_name,
          size_ft,
          status,
          rentals (
            id,
            status,
            notes,
            customer_id,
            customers (
              id,
              name,
              phone,
              notes
            )
          )
        `)
        .eq('yard_id', yardId);

      if (error) throw error;

      const dbByCode = Object.fromEntries(data.map((row) => [row.internal_code, row]));
      state = Object.fromEntries(containers.map((container) => {
        const row = dbByCode[container.id];
        const activeRental = (row?.rentals || []).find((rental) => rental.status === 'active' || rental.status === 'bad_debt');
        const customer = activeRental?.customers;

        return [container.id, {
          dbId: row?.id || null,
          rentalId: activeRental?.id || null,
          customerId: customer?.id || null,
          status: fromDbStatus(row?.status || 'available'),
          name: row?.display_name || container.id,
          size: String(row?.size_ft || inferSize(container)),
          customer: customer?.name || '',
          phone: customer?.phone || '',
          notes: activeRental?.notes || customer?.notes || ''
        }];
      }));
    }

    async function refreshFromSupabase() {
      renderYardShell();
      await loadYard();
      await seedMissingContainers();
      await loadContainerState();
      renderOverlay();
      renderEditor();
      renderList();
      updateCounts();
    }

    async function saveContainer(id) {
      const item = state[id];
      const container = getContainers().find((entry) => entry.id === id);
      if (!item || !container) return;

      if (!item.dbId) {
        const { data, error } = await supabaseClient
          .from('containers')
          .insert({
            yard_id: yardId,
            internal_code: id,
            display_name: item.name || id,
            size_ft: Number(item.size || inferSize(container)),
            status: toDbStatus(item.status || 'available')
          })
          .select('id')
          .single();

        if (error) throw error;
        item.dbId = data.id;
      } else {
        const { error } = await supabaseClient
          .from('containers')
          .update({
            display_name: item.name || id,
            size_ft: Number(item.size || inferSize(container)),
            status: toDbStatus(item.status || 'available')
          })
          .eq('id', item.dbId);

        if (error) throw error;
      }

      if (!item.customer) {
        if (item.rentalId) {
          const { error } = await supabaseClient
            .from('rentals')
            .update({ status: 'ended', notes: item.notes || null })
            .eq('id', item.rentalId);

          if (error) throw error;
        }
        item.rentalId = null;
        item.customerId = null;
        return;
      }

      if (!item.customerId) {
        const { data, error } = await supabaseClient
          .from('customers')
          .insert({
            name: item.customer,
            phone: item.phone || null,
            notes: item.notes || null
          })
          .select('id')
          .single();

        if (error) throw error;
        item.customerId = data.id;
      } else {
        const { error } = await supabaseClient
          .from('customers')
          .update({
            name: item.customer,
            phone: item.phone || null,
            notes: item.notes || null
          })
          .eq('id', item.customerId);

        if (error) throw error;
      }

      if (!item.rentalId) {
        const { data, error } = await supabaseClient
          .from('rentals')
          .insert({
            container_id: item.dbId,
            customer_id: item.customerId,
            status: rentalStatusFor(item.status),
            notes: item.notes || null
          })
          .select('id')
          .single();

        if (error) throw error;
        item.rentalId = data.id;
      } else {
        const { error } = await supabaseClient
          .from('rentals')
          .update({
            customer_id: item.customerId,
            status: rentalStatusFor(item.status),
            notes: item.notes || null
          })
          .eq('id', item.rentalId);

        if (error) throw error;
      }
    }

    function setSelected(id) {
      selectedId = id;
      renderEditor();
      renderList();
    }

    function renderOverlay() {
      overlay.innerHTML = '';
      getContainers().forEach((container) => {
        const item = state[container.id];
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.dataset.id = container.id;
        rect.setAttribute('x', container.x);
        rect.setAttribute('y', container.y);
        rect.setAttribute('width', container.width);
        rect.setAttribute('height', container.height);
        rect.setAttribute('tabindex', 0);
        rect.setAttribute('role', 'button');
        rect.classList.add('container-unit', item.status);
        rect.setAttribute('aria-label', `${containerName(container.id)}, ${item.size}ft, ${labelFor(item.status)}`);
        rect.addEventListener('click', () => setSelected(container.id));
        rect.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setSelected(container.id);
          }
        });
        overlay.append(rect);

        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.dataset.labelFor = container.id;
        label.classList.add('size-label');
        const labelClass = labelClassFor(container);
        if (labelClass) label.classList.add(labelClass);
        label.setAttribute('x', container.x + (container.width / 2));
        label.setAttribute('y', container.y + (container.height / 2));
        label.textContent = item.size;
        overlay.append(label);
      });
    }

    function updateCounts() {
      const totals = { available: 0, rented: 0, 'bad-debt': 0 };
      Object.values(state).forEach((item) => {
        totals[item.status] += 1;
      });
      document.querySelector('#availableCount').textContent = totals.available;
      document.querySelector('#rentedCount').textContent = totals.rented;
      document.querySelector('#badDebtCount').textContent = totals['bad-debt'];
    }

    function applyStatusClass(id) {
      const unit = document.querySelector(`[data-id="${CSS.escape(id)}"]`);
      if (!unit) return;
      unit.classList.remove('available', 'rented', 'bad-debt');
      unit.classList.add(state[id].status);
      unit.setAttribute('aria-label', `${containerName(id)}, ${state[id].size}ft, ${labelFor(state[id].status)}`);
      const label = document.querySelector(`[data-label-for="${CSS.escape(id)}"]`);
      if (label) label.textContent = state[id].size;
    }

    function renderEditor() {
      if (!selectedId) {
        editor.innerHTML = '<p class="empty">Select a container on the map or from the list to update its customer and status.</p>';
        return;
      }

      const item = state[selectedId];
      editor.innerHTML = `
        <div class="field">
          <label for="containerId">Container ID</label>
          <input id="containerId" value="${selectedId}" readonly>
        </div>
        <div class="field">
          <label for="containerName">Container name</label>
          <input id="containerName" placeholder="Container name" value="${escapeHtml(item.name)}">
        </div>
        <div class="field">
          <label for="status">Status</label>
          <select id="status">
            <option value="available">Available</option>
            <option value="rented">Rented</option>
            <option value="bad-debt">Bad debt</option>
          </select>
        </div>
        <div class="field">
          <label for="size">Size</label>
          <select id="size">
            <option value="10">10ft</option>
            <option value="20">20ft</option>
            <option value="40">40ft</option>
          </select>
        </div>
        <div class="field">
          <label for="customer">Customer</label>
          <input id="customer" placeholder="Customer name" value="${escapeHtml(item.customer)}">
        </div>
        <div class="field">
          <label for="phone">Phone or reference</label>
          <input id="phone" placeholder="Phone, invoice, or account ref" value="${escapeHtml(item.phone)}">
        </div>
        <div class="field">
          <label for="notes">Notes</label>
          <textarea id="notes" placeholder="Rental notes">${escapeHtml(item.notes)}</textarea>
        </div>
        <div class="actions">
          <button class="primary" type="submit">Save</button>
          <button class="danger" id="clear" type="button">Clear</button>
        </div>
      `;

      editor.querySelector('#status').value = item.status;
      editor.querySelector('#size').value = item.size;
      editor.querySelector('#clear').addEventListener('click', async () => {
        const selectedContainer = getContainers().find((container) => container.id === selectedId);
        state[selectedId] = {
          ...state[selectedId],
          status: 'available',
          name: selectedId,
          size: inferSize(selectedContainer),
          customer: '',
          phone: '',
          notes: ''
        };

        try {
          await saveContainer(selectedId);
          applyStatusClass(selectedId);
          updateCounts();
          renderEditor();
          renderList();
        } catch (error) {
          alert(`Could not clear container: ${error.message}`);
        }
      });
    }

    editor.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!selectedId) return;

      const customer = editor.querySelector('#customer').value.trim();
      const status = editor.querySelector('#status').value;
      const name = editor.querySelector('#containerName').value.trim() || selectedId;

      state[selectedId] = {
        ...state[selectedId],
        status: customer && status === 'available' ? 'rented' : status,
        name,
        size: editor.querySelector('#size').value,
        customer,
        phone: editor.querySelector('#phone').value.trim(),
        notes: editor.querySelector('#notes').value.trim()
      };

      try {
        await saveContainer(selectedId);
        applyStatusClass(selectedId);
        updateCounts();
        renderEditor();
        renderList();
      } catch (error) {
        alert(`Could not save container: ${error.message}`);
      }
    });

    function renderList() {
      list.innerHTML = '';
      getContainers().forEach((container) => {
        const item = state[container.id];
        const button = document.createElement('button');
        button.className = 'row';
        button.type = 'button';
        button.addEventListener('click', () => setSelected(container.id));
        button.innerHTML = `
          <i class="swatch" style="background: var(--${item.status})"></i>
          <span>
            <span class="row-name">${escapeHtml(containerName(container.id))}</span>
            <span class="row-customer">${item.size}ft - ${escapeHtml(item.customer || 'No customer')}</span>
          </span>
          <span class="pill">${labelFor(item.status)}</span>
        `;
        if (container.id === selectedId) {
          button.style.background = '#eaf3ff';
        }
        list.append(button);
      });
    }

    async function init() {
      renderYardShell();
      showMessage(`Loading ${getCurrentYard().label}...`);

      try {
        if (!hasValidSupabaseConfig()) return;
        const loggedIn = await requireLogin();
        if (!loggedIn) return;
        await refreshFromSupabase();
      } catch (error) {
        showMessage(`Could not load ${getCurrentYard().label}: ${error.message}`);
      }
    }

    init();
