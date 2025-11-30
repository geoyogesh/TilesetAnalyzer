import time
from functools import wraps


def time_format(seconds: float) -> str:
    if seconds is not None:
        seconds = int(seconds)
        d = seconds // (3600 * 24)
        h = seconds // 3600 % 24
        m = seconds % 3600 // 60
        s = seconds % 3600 % 60
        if d > 0:
            return f"{d:02d}D {h:02d}H {m:02d}m {s:02d}s"
        elif h > 0:
            return f"{h:02d}H {m:02d}m {s:02d}s"
        elif m > 0:
            return f"{m:02d}m {s:02d}s"
        elif s > 0:
            return f"{s:02d}s"
    return "-"


def timeit(func):
    @wraps(func)
    def timeit_wrapper(*args, **kwargs):
        start_time = time.perf_counter()
        result = func(*args, **kwargs)
        end_time = time.perf_counter()
        total_time = end_time - start_time
        print(f"Function {func.__name__}{args} {kwargs} Took {time_format(total_time)}")
        return result

    return timeit_wrapper
