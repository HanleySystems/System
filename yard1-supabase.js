    const SUPABASE_URL = 'https://ehtrqdxbeqikjmjvmxii.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVodHJxZHhiZXFpa2ptanZteGlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNTgyNzIsImV4cCI6MjA5NjkzNDI3Mn0.qYzsWqJnxyMLlUU9dN6q1enAKwlwo3MnwZRn_DLcPxk';

    const supabaseClient = window.supabase?.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const overlay = document.querySelector('#overlay');
    const editor = document.querySelector('#editor');
    const list = document.querySelector('#containerList');
    const userEmail = document.querySelector('#userEmail');
    const adminLink = document.querySelector('#adminLink');
    const logoutButton = document.querySelector('#logoutButton');
    const yardTabs = document.querySelector('#yardTabs');
    const yardTitle = document.querySelector('#yardTitle');
    const activeYardName = document.querySelector('#activeYardName');
    const planImage = document.querySelector('#planImage');
    const plan = document.querySelector('#plan');
    const priorityOverlay = document.querySelector('#priorityOverlay');
    const containerTooltip = document.querySelector('#containerTooltip');
    const searchInput = document.querySelector('#searchInput');
    const statusFilter = document.querySelector('#statusFilter');
    const sizeFilter = document.querySelector('#sizeFilter');

    let selectedId = null;
    let yardId = null;
    let state = {};
    let currentSession = null;
    let currentYardKey = localStorage.getItem('active-yard-key') || 'newtown';
    let realtimeChannel = null;
    let realtimeYardKey = null;
    let realtimeRefreshTimer = null;
    let staffNames = {};
    const filters = {
      search: '',
      status: 'all',
      size: 'all'
    };

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

    function remapNewtownContainer(container) {
      // The revised plan removes these former positions altogether.
      if (['C-061', 'C-176', 'C-183', 'C-184', 'C-185', 'C-186', 'C-187', 'C-208'].includes(container.id)) return null;

      let x = container.x - 1086;
      let y = container.y - 3;

      if (container.y >= 1300 && container.x < 2100) {
        x = container.x - 479;
      } else if (container.x === 2105) {
        // This centre-left run now starts lower on the current plan.
        y += 488;
      } else if (container.x === 2249 && container.y >= 395) {
        // This centre-right run now starts lower on the current plan.
        y += 458;
      } else if (container.x < 800) {
        x = container.x - 127;
        y = container.y + 161;
        if (container.x === 161) {
          // The far-left vertical run was moved lower as a complete block.
          y += 263;
        }
      }

      const scaleX = 4860 / 3774;
      const scaleY = 1800 / 1797;
      return {
        ...container,
        x: x * scaleX,
        y: y * scaleY,
        width: container.width * scaleX,
        height: container.height * scaleY
      };
    }

    const REMAPPED_NEWTOWN_CONTAINERS = NEWTOWN_CONTAINERS
      .map(remapNewtownContainer)
      .filter(Boolean);

    // Two 20ft containers added to the revised plan at the upper centre.
    const EXTRA_NEWTOWN_CONTAINERS = [
      { id: 'C-213', x: 1385, y: 100, width: 73, height: 76 },
      { id: 'C-214', x: 1384, y: 181, width: 73, height: 77 }
    ];

    const PRIORITY_NEWTOWN_CONTAINER_IDS = new Set(['C-039', 'C-057', 'C-060']);

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

    const WICKLOW_A_REMOVED_CONTAINERS = new Set(['WA-057', 'WA-058']);

    const WICKLOW_A_CONTAINERS = makeCells('WA', [
      { xs: [65, 157, 250, 343, 436, 529, 622, 715, 808, 901, 994, 1087, 1180], ys: [33, 105] },
      { xs: [49, 113], ys: [138, 174, 211, 247, 283, 320, 356, 392, 429, 465, 502, 538, 574, 611, 647, 684, 720, 756] },
      { xs: [1180, 1254], ys: [162, 202, 243, 283, 324, 364, 405, 445, 485, 526, 566, 607] },
      { xs: [558, 647, 736], ys: [309, 341, 373, 405, 437, 469, 502, 534, 567] },
      { xs: [235, 336, 437, 538, 639, 740, 841, 942], ys: [786, 857] }
    ]).filter((container) => !WICKLOW_A_REMOVED_CONTAINERS.has(container.id));

    const WICKLOW_B_CONTAINERS = makeCells('WB', [
      { xs: [48, 138, 243, 299, 356, 412, 469, 526, 582, 639, 720, 809], ys: [33, 105] },
      { xs: [32, 97], ys: [138, 183, 227, 272, 316, 361, 405, 450, 494, 539, 583, 628, 672, 716] },
      { xs: [1085, 1151], ys: [138, 210] },
      { xs: [1085, 1151], ys: [219, 251, 283, 316, 348, 381, 413, 445, 478, 510, 542, 575, 607, 639, 672, 704] },
      { xs: [526, 615, 704], ys: [309, 341, 373, 405, 437, 469, 502, 534, 567] },
      { xs: [437, 551, 664, 778, 891, 1004], ys: [786, 857] },
      { xs: [1085, 1151], ys: [786, 857] }
    ]);

    const yardConfigs = {
      newtown: {
        slug: 'yard1',
        label: 'Newtown Yard',
        image: 'warehouse.png',
        width: 4860,
        height: 1800,
        displayWidth: 'min(1400px, 100%)',
        featureImages: [
          {
            image: 'hanley-removals-container.png',
            x: 2646,
            y: 257,
            width: 1147,
            height: 1019
          },
          {
            image: 'hanley-removals-container.png',
            x: 262,
            y: 329,
            width: 1040,
            height: 1030
          }
        ],
        gates: [{ x: 2663, y: 1557, width: 328, height: 97 }],
        containers: [...REMAPPED_NEWTOWN_CONTAINERS, ...EXTRA_NEWTOWN_CONTAINERS]
      },
      wicklowA: {
        slug: 'yard2',
        label: 'Wicklow Yard A',
        image: 'wicklow-yard-a.png',
        width: 1293,
        height: 889,
        displayWidth: 'min(980px, 100%)',
        gates: [{ x: 980, y: 793, width: 153, height: 63 }],
        containers: WICKLOW_A_CONTAINERS
      },
      wicklowB: {
        slug: 'yard3',
        label: 'Wicklow Yard B',
        image: 'wicklow-yard-b.png',
        width: 1293,
        height: 889,
        displayWidth: 'min(980px, 100%)',
        gates: [{ x: 173, y: 783, width: 203, height: 74 }],
        containers: WICKLOW_B_CONTAINERS
      }
    };

    function getCurrentYard() {
      return yardConfigs[currentYardKey] || yardConfigs.newtown;
    }

    function getContainers() {
      const yard = getCurrentYard();
      return yard.containers.filter((container) => !isInsideGate(container, yard.gates || []));
    }

    function isInsideGate(container, gates) {
      const centerX = container.x + (container.width / 2);
      const centerY = container.y + (container.height / 2);
      return gates.some((gate) => (
        centerX >= gate.x &&
        centerX <= gate.x + gate.width &&
        centerY >= gate.y &&
        centerY <= gate.y + gate.height
      ));
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

    function positionContainerTooltip(clientX, clientY) {
      if (!containerTooltip || containerTooltip.hidden) return;

      const margin = 12;
      const offset = 14;
      const maxLeft = window.innerWidth - containerTooltip.offsetWidth - margin;
      const maxTop = window.innerHeight - containerTooltip.offsetHeight - margin;
      containerTooltip.style.left = `${Math.max(margin, Math.min(clientX + offset, maxLeft))}px`;
      containerTooltip.style.top = `${Math.max(margin, Math.min(clientY + offset, maxTop))}px`;
    }

    function showContainerTooltip(id, clientX, clientY) {
      const item = state[id];
      if (!containerTooltip || !item) return;

      containerTooltip.querySelector('strong').textContent = containerName(id);
      containerTooltip.querySelector('span').textContent = `${item.size}ft container`;
      containerTooltip.hidden = false;
      positionContainerTooltip(clientX, clientY);
    }

    function hideContainerTooltip() {
      if (containerTooltip) containerTooltip.hidden = true;
    }

    function staffName(id) {
      if (!id) return '';
      return staffNames[id] || (id === currentSession?.user?.id ? currentSession.user.email : 'Staff member');
    }

    function formatDateTime(value) {
      if (!value) return '';
      return new Intl.DateTimeFormat('en-IE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(value));
    }

    function inferSize(container) {
      const longestSide = Math.max(container.width, container.height);
      if (longestSide < 72) return '10';
      if (longestSide < 150) return '20';
      return '40';
    }

    function labelClassFor(container) {
      const shortestSide = Math.min(container.width, container.height);
      if (shortestSide < 70) return 'tiny';
      if (shortestSide < 120) return 'small';
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

      const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('role, is_active')
        .eq('id', currentSession.user.id)
        .single();

      if (profileError || !profile?.is_active) {
        await supabaseClient.auth.signOut();
        window.location.replace('login.html?reason=inactive');
        return false;
      }

      if (adminLink) {
        adminLink.hidden = profile.role !== 'admin';
      }

      return true;
    }

    if (logoutButton) {
      logoutButton.addEventListener('click', async () => {
        logoutButton.disabled = true;
        logoutButton.textContent = 'Logging out...';
        try {
          if (realtimeChannel) {
            await supabaseClient.removeChannel(realtimeChannel);
            realtimeChannel = null;
            realtimeYardKey = null;
          }

          const { error } = await supabaseClient.auth.signOut();
          if (error) throw error;
          window.location.href = 'login.html';
        } catch (error) {
          alert(`Could not log out: ${error.message}`);
          logoutButton.disabled = false;
          logoutButton.textContent = 'Logout';
        }
      });
    }

    if (supabaseClient) {
      supabaseClient.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_OUT') {
          window.location.href = 'login.html';
        }
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
      priorityOverlay.setAttribute('viewBox', `0 0 ${yard.width} ${yard.height}`);
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
      const staffId = currentSession?.user?.id;
      if (!staffId) throw new Error('A signed-in staff account is required.');

      const rows = getContainers().map((container) => ({
        yard_id: yardId,
        internal_code: container.id,
        display_name: container.id,
        size_ft: Number(inferSize(container)),
        status: 'available',
        updated_by: staffId
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
          updated_by,
          updated_at,
          rentals (
            id,
            status,
            notes,
            customer_id,
            created_by,
            updated_by,
            created_at,
            updated_at,
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

      const staffIds = new Set();
      data.forEach((row) => {
        if (row.updated_by) staffIds.add(row.updated_by);
        (row.rentals || []).forEach((rental) => {
          if (rental.created_by) staffIds.add(rental.created_by);
          if (rental.updated_by) staffIds.add(rental.updated_by);
        });
      });

      if (staffIds.size) {
        const { data: profiles, error: profilesError } = await supabaseClient
          .from('profiles')
          .select('id, full_name')
          .in('id', [...staffIds]);

        if (profilesError) throw profilesError;
        staffNames = Object.fromEntries((profiles || []).map((profile) => [
          profile.id,
          profile.full_name || 'Staff member'
        ]));
      } else {
        staffNames = {};
      }

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
          notes: activeRental?.notes || customer?.notes || '',
          updatedBy: row?.updated_by || '',
          updatedAt: row?.updated_at || '',
          rentalCreatedBy: activeRental?.created_by || '',
          rentalUpdatedBy: activeRental?.updated_by || '',
          rentalCreatedAt: activeRental?.created_at || '',
          rentalUpdatedAt: activeRental?.updated_at || ''
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
      subscribeToRealtimeUpdates();
    }

    function queueRealtimeRefresh() {
      clearTimeout(realtimeRefreshTimer);

      realtimeRefreshTimer = setTimeout(async () => {
        const focusedElement = document.activeElement;
        const userIsEditing = editor.contains(focusedElement);

        try {
          await loadContainerState();
          renderOverlay();
          renderList();
          updateCounts();

          if (!userIsEditing) {
            renderEditor();
          }
        } catch (error) {
          console.error('Realtime refresh failed:', error);
        }
      }, 300);
    }

    function subscribeToRealtimeUpdates() {
      if (!supabaseClient || !yardId) return;

      if (realtimeYardKey === currentYardKey && realtimeChannel) {
        return;
      }

      if (realtimeChannel) {
        supabaseClient.removeChannel(realtimeChannel);
      }

      realtimeYardKey = currentYardKey;

      realtimeChannel = supabaseClient
        .channel(`yard-live-updates-${getCurrentYard().slug}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'containers',
            filter: `yard_id=eq.${yardId}`
          },
          queueRealtimeRefresh
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'rentals'
          },
          queueRealtimeRefresh
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'customers'
          },
          queueRealtimeRefresh
        )
        .subscribe((status) => {
          console.log('Realtime status:', status);
        });
    }

    async function saveContainer(id) {
      const item = state[id];
      const container = getContainers().find((entry) => entry.id === id);
      const staffId = currentSession?.user?.id || null;
      if (!item || !container) return;

      if (!item.dbId) {
        const { data, error } = await supabaseClient
          .from('containers')
          .insert({
            yard_id: yardId,
            internal_code: id,
            display_name: item.name || id,
            size_ft: Number(item.size || inferSize(container)),
            status: toDbStatus(item.status || 'available'),
            updated_by: staffId
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
            status: toDbStatus(item.status || 'available'),
            updated_by: staffId
          })
          .eq('id', item.dbId);

        if (error) throw error;
      }

      if (!item.customer) {
        if (item.rentalId) {
          const { error } = await supabaseClient
            .from('rentals')
            .update({ status: 'ended', notes: item.notes || null, updated_by: staffId })
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
            notes: item.notes || null,
            created_by: staffId,
            updated_by: staffId
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
            notes: item.notes || null,
            updated_by: staffId
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

    function appendInteractiveContainer(target, container) {
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
      rect.addEventListener('mouseenter', (event) => showContainerTooltip(container.id, event.clientX, event.clientY));
      rect.addEventListener('mousemove', (event) => positionContainerTooltip(event.clientX, event.clientY));
      rect.addEventListener('mouseleave', hideContainerTooltip);
      rect.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setSelected(container.id);
        }
      });
      rect.addEventListener('focus', () => {
        const bounds = rect.getBoundingClientRect();
        showContainerTooltip(container.id, bounds.right, bounds.top);
      });
      rect.addEventListener('blur', hideContainerTooltip);
      target.append(rect);

      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.dataset.labelFor = container.id;
      label.classList.add('size-label');
      const labelClass = labelClassFor(container);
      if (labelClass) label.classList.add(labelClass);
      label.setAttribute('x', container.x + (container.width / 2));
      label.setAttribute('y', container.y + (container.height / 2));
      label.textContent = item.size;
      target.append(label);
    }

    function renderPriorityOverlay() {
      priorityOverlay.innerHTML = '';
      if (currentYardKey !== 'newtown') return;
      getContainers()
        .filter((container) => PRIORITY_NEWTOWN_CONTAINER_IDS.has(container.id))
        .forEach((container) => appendInteractiveContainer(priorityOverlay, container));
    }

    function renderOverlay() {
      overlay.innerHTML = '';
      const yard = getCurrentYard();

      (yard.featureImages || []).forEach((feature) => {
        const featureImage = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        featureImage.setAttribute('href', feature.image);
        featureImage.setAttribute('x', feature.x);
        featureImage.setAttribute('y', feature.y);
        featureImage.setAttribute('width', feature.width);
        featureImage.setAttribute('height', feature.height);
        featureImage.setAttribute('preserveAspectRatio', 'xMidYMid slice');
        featureImage.classList.add('warehouse-feature');
        overlay.append(featureImage);
      });

      (yard.gates || []).forEach((gate) => {
        const gateFeature = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        gateFeature.setAttribute('x', gate.x);
        gateFeature.setAttribute('y', gate.y);
        gateFeature.setAttribute('width', gate.width);
        gateFeature.setAttribute('height', gate.height);
        gateFeature.classList.add('gate-feature');
        gateFeature.setAttribute('aria-label', 'Gate');
        overlay.append(gateFeature);
      });

      getContainers().forEach((container) => appendInteractiveContainer(overlay, container));
      renderPriorityOverlay();
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
      const units = document.querySelectorAll(`[data-id="${CSS.escape(id)}"]`);
      units.forEach((unit) => {
        unit.classList.remove('available', 'rented', 'bad-debt');
        unit.classList.add(state[id].status);
        unit.setAttribute('aria-label', `${containerName(id)}, ${state[id].size}ft, ${labelFor(state[id].status)}`);
      });
      document.querySelectorAll(`[data-label-for="${CSS.escape(id)}"]`).forEach((label) => {
        label.textContent = state[id].size;
      });
    }

    function renderEditor() {
      if (!selectedId) {
        editor.innerHTML = '<p class="empty">Select a container on the map or from the list to update its customer and status.</p>';
        return;
      }

      const item = state[selectedId];
      const rentedBy = staffName(item.rentalCreatedBy || item.rentalUpdatedBy);
      const changedBy = staffName(item.updatedBy || item.rentalUpdatedBy);
      const changedAt = formatDateTime(item.rentalUpdatedAt || item.updatedAt);
      editor.innerHTML = `
        <div class="field">
          <label for="containerId">Container ID</label>
          <input id="containerId" value="${selectedId}" readonly>
        </div>
        <div class="metadata">
          <span><strong>Rented by:</strong> ${escapeHtml(rentedBy || 'Not rented')}</span>
          <span><strong>Last changed by:</strong> ${escapeHtml(changedBy || 'No changes yet')}</span>
          <span><strong>Last changed:</strong> ${escapeHtml(changedAt || 'No timestamp yet')}</span>
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

    function matchesFilters(container, item) {
      const term = filters.search.toLowerCase();
      const haystack = [
        container.id,
        item.name,
        item.customer,
        item.phone,
        item.notes,
        labelFor(item.status),
        item.size
      ].join(' ').toLowerCase();

      return (!term || haystack.includes(term))
        && (filters.status === 'all' || item.status === filters.status)
        && (filters.size === 'all' || item.size === filters.size);
    }

    function renderList() {
      list.innerHTML = '';
      const visibleContainers = getContainers().filter((container) => {
        const item = state[container.id];
        return item && matchesFilters(container, item);
      });

      if (!visibleContainers.length) {
        list.innerHTML = '<p class="empty list-empty">No containers match the current filters.</p>';
        return;
      }

      visibleContainers.forEach((container) => {
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
          button.classList.add('selected');
        }
        list.append(button);
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        filters.search = searchInput.value.trim();
        renderList();
      });
    }

    if (statusFilter) {
      statusFilter.addEventListener('change', () => {
        filters.status = statusFilter.value;
        renderList();
      });
    }

    if (sizeFilter) {
      sizeFilter.addEventListener('change', () => {
        filters.size = sizeFilter.value;
        renderList();
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
