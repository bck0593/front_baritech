def generate_ai_advice(df, user_message=None, user_info=None):
    import pandas as pd
    from ai_client import ai_message  # ai_client.pyの関数を呼ぶ

    if user_info is None:
        user_info = {"age": None, "family": None, "savings": 0, "goal": 0, "salary": None}

    df["date"] = pd.to_datetime(df["date"])

    df_month = df.groupby(pd.Grouper(key="date", freq="M"))["amount"].sum().reset_index()
    df_month["income"] = df_month["amount"].apply(lambda x: x if x > 0 else 0)
    df_month["expense"] = df_month["amount"].apply(lambda x: -x if x < 0 else 0)
    df_month["balance"] = df_month["income"] - df_month["expense"]

    df_year = df.groupby(pd.Grouper(key="date", freq="Y"))["amount"].sum().reset_index()
    df_year["income"] = df_year["amount"].apply(lambda x: x if x > 0 else 0)
    df_year["expense"] = df_year["amount"].apply(lambda x: -x if x < 0 else 0)
    df_year["balance"] = df_year["income"] - df_year["expense"]

    latest_month = df_month.tail(1).iloc[0]
    month_summary = (
        f"{latest_month['date'].strftime('%Y-%m')} - 収入: {int(latest_month['income']):,}円, "
        f"支出: {int(latest_month['expense']):,}円, 残高: {int(latest_month['balance']):,}円"
    )

    latest_year = df_year.tail(1).iloc[0]
    year_summary = (
        f"{latest_year['date'].strftime('%Y')}年 - 収入: {int(latest_year['income']):,}円, "
        f"支出: {int(latest_year['expense']):,}円, 残高: {int(latest_year['balance']):,}円"
    )

    # ai_message関数に必要情報を渡す
    response = ai_message(
        user_message=user_message,
        age=user_info.get("age"),
        salary=user_info.get("salary"),
        family=user_info.get("family"),
        savings=user_info.get("savings"),
        goal=user_info.get("goal"),
        month_summary=month_summary,
        year_summary=year_summary,
    )

    return response
